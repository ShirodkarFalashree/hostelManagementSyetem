import React, { useState, useEffect } from "react";
import {
  BedDouble,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  Plus,
  RefreshCw,
  UserX,
  Zap,
  Filter,
  Check,
  X,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function WardenRooms() {
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [roomChangeRequests, setRoomChangeRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("ROOMS"); // ROOMS, MANUAL, AUTO, REQUESTS

  // Manual Allocation Form
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedBedNo, setSelectedBedNo] = useState("Bed-1");

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setRooms(Store.getRooms());
    setApplications(Store.getApplications());
    setRoomChangeRequests(Store.getRoomChanges());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("hms_store_updated", loadData);
    return () => window.removeEventListener("hms_store_updated", loadData);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Approved Students without active room allocation
  const approvedApplicants = applications.filter(
    (app) => (app.status === "APPROVED" || app.status === "SUBMITTED") && !app.allocatedRoom
  );

  // Manual Allocation Handler
  const handleManualAllocate = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedRoomId) return;

    setIsLoading(true);
    setTimeout(() => {
      const student = applications.find((a) => a.id === selectedStudentId || a.studentId === selectedStudentId);
      const targetRoom = rooms.find((r) => r.id === selectedRoomId);

      if (!student || !targetRoom) return;

      // Update room beds
      const updatedBeds = targetRoom.beds.map((b) => {
        if (b.bedNo === selectedBedNo) {
          return { bedNo: b.bedNo, status: "OCCUPIED", student: `${student.fullName} (${student.rollNo})` };
        }
        return b;
      });

      const updatedRoom = {
        ...targetRoom,
        occupancy: updatedBeds.filter((b) => b.status === "OCCUPIED").length,
        status: updatedBeds.every((b) => b.status === "OCCUPIED") ? "OCCUPIED" : "AVAILABLE",
        beds: updatedBeds,
      };

      Store.updateRoom(updatedRoom);

      // Update student application status
      Store.saveApplication({
        ...student,
        status: "ALLOCATED",
        allocatedRoom: targetRoom.roomNumber,
        allocatedBed: selectedBedNo,
        remarks: `Manually allocated to ${targetRoom.roomNumber} (${selectedBedNo}) by Warden.`,
        timeline: [
          ...student.timeline,
          { title: "Room Allocated", date: new Date().toLocaleString(), status: "COMPLETED", remarks: `Allocated ${targetRoom.roomNumber}` },
        ],
      });

      setIsLoading(false);
      setShowManualModal(false);
      loadData();
      showToast(`Allocated ${student.fullName} to ${targetRoom.roomNumber} (${selectedBedNo})`);
    }, 700);
  };

  // Automatic Allocation Engine Algorithm
  const handleAutoAllocateEngine = () => {
    setIsLoading(true);
    setTimeout(() => {
      let allocatedCount = 0;

      // Sort pending approved applicants by CGPA & submission date (Merit priority)
      const sortedApplicants = [...approvedApplicants].sort((a, b) => parseFloat(b.cgpa || 0) - parseFloat(a.cgpa || 0));

      const updatedRooms = [...rooms];

      sortedApplicants.forEach((app) => {
        // Find matching available room bed
        for (let r of updatedRooms) {
          const availBed = r.beds.find((b) => b.status === "AVAILABLE");
          if (availBed) {
            availBed.status = "OCCUPIED";
            availBed.student = `${app.fullName} (${app.rollNo})`;
            r.occupancy = r.beds.filter((b) => b.status === "OCCUPIED").length;
            r.status = r.occupancy === r.capacity ? "OCCUPIED" : "AVAILABLE";

            Store.updateRoom(r);
            Store.saveApplication({
              ...app,
              status: "ALLOCATED",
              allocatedRoom: r.roomNumber,
              allocatedBed: availBed.bedNo,
              remarks: `Auto-allocated based on CGPA ${app.cgpa} & Preference.`,
              timeline: [
                ...app.timeline,
                { title: "Auto Allocated", date: new Date().toLocaleString(), status: "COMPLETED", remarks: `Assigned to ${r.roomNumber}` },
              ],
            });

            allocatedCount++;
            break;
          }
        }
      });

      setIsLoading(false);
      loadData();
      showToast(`Auto-allocation algorithm processed! Allocated ${allocatedCount} students.`);
    }, 1200);
  };

  // Vacate Student Handler
  const handleVacateStudent = (roomId, bedNo, studentName) => {
    setIsLoading(true);
    setTimeout(() => {
      const targetRoom = rooms.find((r) => r.id === roomId);
      if (!targetRoom) return;

      const updatedBeds = targetRoom.beds.map((b) => {
        if (b.bedNo === bedNo) {
          return { bedNo: b.bedNo, status: "AVAILABLE", student: null };
        }
        return b;
      });

      const updatedRoom = {
        ...targetRoom,
        occupancy: updatedBeds.filter((b) => b.status === "OCCUPIED").length,
        status: "AVAILABLE",
        beds: updatedBeds,
      };

      Store.updateRoom(updatedRoom);
      setIsLoading(false);
      loadData();
      showToast(`Vacated bed ${bedNo} in Room ${targetRoom.roomNumber}`);
    }, 600);
  };

  // Room Change Request Decision
  const handleRoomChangeDecision = (reqId, decision) => {
    setIsLoading(true);
    setTimeout(() => {
      Store.updateRoomChangeRequest(reqId, {
        status: decision,
        remarks: `Request ${decision} by Warden on ${new Date().toLocaleString()}`,
      });
      setIsLoading(false);
      loadData();
      showToast(`Room change request ${reqId} ${decision}!`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Room & Bed Allocation Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage hostel inventory, manual and automated bed allocation, reallocations, and room change requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoAllocateEngine}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md transition"
          >
            <Zap size={16} /> Run Auto-Allocation Engine
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
          >
            <Plus size={16} /> Manual Allocation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "ROOMS", label: "Rooms & Beds Grid" },
          { key: "REQUESTS", label: `Room Change Requests (${roomChangeRequests.length})` },
          { key: "UNALLOCATED", label: `Unallocated Students (${approvedApplicants.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content for TAB 1: ROOMS GRID */}
      {activeTab === "ROOMS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Room {room.roomNumber}</h3>
                  <p className="text-xs text-slate-500">{room.hostel} · {room.block}</p>
                </div>
                <StatusBadge status={room.status} />
              </div>

              <p className="text-xs font-semibold text-slate-700">{room.roomType}</p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bed Status</span>
                {room.beds.map((bed, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{bed.bedNo}: </span>
                      <span className="text-slate-600">{bed.student || "Empty Bed"}</span>
                    </div>
                    {bed.status === "OCCUPIED" && (
                      <button
                        onClick={() => handleVacateStudent(room.id, bed.bedNo, bed.student)}
                        className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <UserX size={12} /> Vacate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for TAB 2: ROOM CHANGE REQUESTS */}
      {activeTab === "REQUESTS" && (
        <div className="space-y-4">
          <DataTable
            columns={[
              { header: "Request ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
              { header: "Student Name", accessor: "studentName", render: (r) => <span className="font-bold text-slate-900">{r.studentName} ({r.rollNo})</span> },
              { header: "Current Room", accessor: "currentRoom" },
              { header: "Requested Block & Type", render: (r) => <span>{r.preferredBlock} ({r.preferredRoomType})</span> },
              { header: "Reason", accessor: "reason", render: (r) => <span className="italic text-slate-600 text-xs">"{r.reason}"</span> },
              { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
              {
                header: "Actions",
                render: (r) =>
                  r.status === "UNDER REVIEW" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRoomChangeDecision(r.id, "APPROVED")}
                        className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleRoomChangeDecision(r.id, "REJECTED")}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Decided</span>
                  ),
              },
            ]}
            data={roomChangeRequests}
            searchPlaceholder="Search room change requests..."
            searchKey="studentName"
            emptyMessage="No pending room change requests."
          />
        </div>
      )}

      {/* Content for TAB 3: UNALLOCATED STUDENTS */}
      {activeTab === "UNALLOCATED" && (
        <DataTable
          columns={[
            { header: "App ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
            { header: "Student Name", accessor: "fullName", render: (r) => <span className="font-bold text-slate-900">{r.fullName} ({r.rollNo})</span> },
            { header: "Course", accessor: "course" },
            { header: "CGPA", accessor: "cgpa", render: (r) => <span className="font-bold text-slate-900">{r.cgpa}</span> },
            { header: "Preference", render: (r) => <span>{r.hostelPreference} ({r.roomTypePreference})</span> },
            { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          data={approvedApplicants}
          searchPlaceholder="Search unallocated students..."
          searchKey="fullName"
          emptyMessage="All approved students have been allocated rooms."
        />
      )}

      {/* Manual Allocation Modal */}
      <Modal isOpen={showManualModal} onClose={() => setShowManualModal(false)} title="Manual Room & Bed Allocation">
        <form onSubmit={handleManualAllocate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
            >
              <option value="">-- Select Approved Student --</option>
              {approvedApplicants.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.fullName} ({app.rollNo}) - {app.hostelPreference}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Room *</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
            >
              <option value="">-- Select Available Room --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} ({r.hostel} · Occupancy: {r.occupancy}/{r.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Bed Slot</label>
            <select
              value={selectedBedNo}
              onChange={(e) => setSelectedBedNo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
            >
              <option value="Bed-1">Bed-1</option>
              <option value="Bed-2">Bed-2</option>
              <option value="Bed-3">Bed-3</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowManualModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              Confirm Allocation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
