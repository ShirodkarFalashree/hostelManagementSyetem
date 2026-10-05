import React, { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Eye,
  Wrench,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

const STAFF_LIST = [
  { id: "STAFF-02", name: "Rajesh Kumar (Plumber)" },
  { id: "STAFF-03", name: "Suresh Sharma (Electrician)" },
  { id: "STAFF-04", name: "Ramesh Carpenter (Carpenter)" },
  { id: "STAFF-05", name: "Amit Verma (IT Tech)" },
  { id: "STAFF-06", name: "Lakshmi Housekeeping (Cleaner)" },
];

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState(STAFF_LIST[0].name);
  const [priority, setPriority] = useState("Medium");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadComplaints = () => setComplaints(Store.getComplaints());

  useEffect(() => {
    loadComplaints();
    window.addEventListener("hms_store_updated", loadComplaints);
    return () => window.removeEventListener("hms_store_updated", loadComplaints);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAssignStaff = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsLoading(true);
    setTimeout(() => {
      const staffObj = STAFF_LIST.find((s) => s.name === assignedStaff) || STAFF_LIST[0];

      Store.updateComplaint(selectedComplaint.id, {
        status: "ASSIGNED",
        assignedStaff: staffObj.name,
        assignedStaffId: staffObj.id,
        priority: priority,
        updatedAt: new Date().toLocaleString(),
        timeline: [
          ...selectedComplaint.timeline,
          { title: "Staff Assigned", date: new Date().toLocaleString(), status: "COMPLETED", remarks: `Assigned to ${staffObj.name}` },
        ],
      });

      // Automatically create a maintenance work order for staff
      const newWO = {
        id: `WO-2026-0${Math.floor(80 + Math.random() * 20)}`,
        complaintId: selectedComplaint.id,
        title: selectedComplaint.title,
        category: selectedComplaint.category,
        roomNo: selectedComplaint.roomNo,
        priority: priority,
        assignedStaff: staffObj.name,
        assignedStaffId: staffObj.id,
        status: "ASSIGNED",
        targetDate: new Date().toISOString().split("T")[0],
        notes: "Assigned by Warden",
        proofImage: null,
      };

      const existingWO = Store.getWorkOrders();
      Store.updateWorkOrder(newWO.id, newWO);

      setIsLoading(false);
      setShowAssignModal(false);
      loadComplaints();
      showToast(`Assigned ${staffObj.name} to complaint ${selectedComplaint.id}`);
    }, 600);
  };

  const columns = [
    { header: "Ticket ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Student & Room", render: (r) => <span className="font-bold text-slate-900">{r.studentName} ({r.roomNo})</span> },
    { header: "Category", accessor: "category" },
    { header: "Title", accessor: "title", render: (r) => <span className="font-bold text-slate-900 block">{r.title}</span> },
    { header: "Priority", accessor: "priority", render: (r) => <span className="font-extrabold text-xs">{r.priority}</span> },
    { header: "Assigned Staff", accessor: "assignedStaff" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Action",
      render: (r) => (
        <button
          onClick={() => {
            setSelectedComplaint(r);
            setAssignedStaff(r.assignedStaff !== "Pending Warden Assignment" ? r.assignedStaff : STAFF_LIST[0].name);
            setPriority(r.priority);
            setShowAssignModal(true);
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
        >
          <UserPlus size={14} /> Assign / Edit
        </button>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-slate-900">Student Complaint Resolution Center</h1>
          <p className="mt-1 text-sm text-slate-500">
            View student complaints, assign specialized maintenance staff, set priority, and monitor progress.
          </p>
        </div>
      </div>

      {/* Complaints Table */}
      <DataTable
        columns={columns}
        data={complaints}
        searchPlaceholder="Search complaints by ID, room, or student..."
        searchKey="title"
        emptyMessage="No complaints registered."
      />

      {/* Assign Staff Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title={`Assign Maintenance Staff: ${selectedComplaint?.id}`}>
        {selectedComplaint && (
          <form onSubmit={handleAssignStaff} className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-900">{selectedComplaint.title}</span>
              <p className="text-slate-600">Category: {selectedComplaint.category} · Room: {selectedComplaint.roomNo}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Staff Member *</label>
              <select
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                {STAFF_LIST.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Update Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
