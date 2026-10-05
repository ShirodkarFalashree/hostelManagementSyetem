import React, { useState, useEffect } from "react";
import {
  BedDouble,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { Store } from "../../services/store";

export default function StudentRoom() {
  const [allocatedRoom, setAllocatedRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [roomChangeRequests, setRoomChangeRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Room Change Form
  const [changeForm, setChangeForm] = useState({
    preferredBlock: "Block B",
    preferredRoomType: "Single Room - AC",
    reason: "",
  });

  const [formError, setFormError] = useState("");

  const loadData = () => {
    const rooms = Store.getRooms();
    setAllRooms(rooms);
    // Find room allocated to Falashree (B-203)
    const myRoom = rooms.find((r) => r.roomNumber === "B-203");
    setAllocatedRoom(myRoom);

    const changes = Store.getRoomChanges();
    const myChanges = changes.filter((c) => c.studentId === "STU-1042");
    setRoomChangeRequests(myChanges);
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

  const handleCreateRoomChange = (e) => {
    e.preventDefault();
    if (!changeForm.reason.trim()) {
      setFormError("Please state a valid reason for room change.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newReq = {
        id: `RC-2026-00${Math.floor(10 + Math.random() * 90)}`,
        studentId: "STU-1042",
        studentName: "Falashree",
        rollNo: "2024CS1042",
        currentRoom: allocatedRoom ? allocatedRoom.roomNumber : "B-203",
        preferredBlock: changeForm.preferredBlock,
        preferredRoomType: changeForm.preferredRoomType,
        reason: changeForm.reason,
        status: "UNDER REVIEW",
        requestDate: new Date().toLocaleString(),
        remarks: "Submitted and pending Warden review.",
      };

      Store.addRoomChangeRequest(newReq);
      setIsLoading(false);
      setShowRequestModal(false);
      setChangeForm({ preferredBlock: "Block B", preferredRoomType: "Single Room - AC", reason: "" });
      setFormError("");
      loadData();
      showToast("Room change request submitted successfully!");
    }, 700);
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
          <h1 className="text-2xl font-bold text-slate-900">My Room & Bed Details</h1>
          <p className="mt-1 text-sm text-slate-500">
            View allocated hostel details, roommates, amenities, and room-change requests.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <RefreshCw size={16} /> Request Room Change
        </button>
      </div>

      {/* Allocated Room Overview Card */}
      {allocatedRoom ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                  <BedDouble size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">Room {allocatedRoom.roomNumber}</h2>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                      Allocated (Bed-1)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {allocatedRoom.hostel} · {allocatedRoom.block} · {allocatedRoom.floor}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Room Type</span>
                <span className="text-sm font-bold text-slate-900">{allocatedRoom.roomType}</span>
              </div>
            </div>

            {/* Room Amenities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Room Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {allocatedRoom.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Roommates Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Roommates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allocatedRoom.beds.map((bed, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border transition ${
                      bed.bedNo === "Bed-1"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold uppercase ${
                          bed.bedNo === "Bed-1" ? "text-amber-400" : "text-slate-500"
                        }`}
                      >
                        {bed.bedNo} {bed.bedNo === "Bed-1" && "(You)"}
                      </span>
                      <Users size={18} className={bed.bedNo === "Bed-1" ? "text-amber-400" : "text-slate-400"} />
                    </div>
                    <p className="font-bold text-sm">{bed.student || "Unoccupied Bed"}</p>
                    <p className={`text-xs mt-1 ${bed.bedNo === "Bed-1" ? "text-slate-300" : "text-slate-500"}`}>
                      {bed.bedNo === "Bed-1" ? "Computer Science · 3rd Year" : "Computer Science · 3rd Year"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Room Change Requests */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Room Change Requests</h3>
              <span className="text-xs font-bold text-slate-400">{roomChangeRequests.length} total</span>
            </div>

            <div className="space-y-4">
              {roomChangeRequests.length > 0 ? (
                roomChangeRequests.map((req) => (
                  <div key={req.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{req.id}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        <span className="font-bold text-slate-800">Target:</span> {req.preferredBlock} (
                        {req.preferredRoomType})
                      </p>
                      <p className="italic text-slate-500">"{req.reason}"</p>
                      <span className="block text-[10px] text-slate-400 mt-2">Requested: {req.requestDate}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Info size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No room change requests submitted.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loader text="Loading room details..." />
      )}

      {/* Available Rooms Overview Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Live Block & Room Occupancy Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allRooms.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{r.roomNumber}</span>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-xs text-slate-500">{r.roomType}</p>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <span>Occupancy</span>
                <span className="font-bold">
                  {r.occupancy} / {r.capacity} Beds
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Change Request Modal */}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Submit Room Change Request">
        <form onSubmit={handleCreateRoomChange} className="space-y-5">
          {formError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-semibold">
              ⚠️ {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Room</label>
            <input
              type="text"
              readOnly
              value={allocatedRoom ? `${allocatedRoom.roomNumber} (${allocatedRoom.roomType})` : "B-203"}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs text-slate-700 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Block</label>
            <select
              value={changeForm.preferredBlock}
              onChange={(e) => setChangeForm({ ...changeForm, preferredBlock: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white"
            >
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Room Type
            </label>
            <select
              value={changeForm.preferredRoomType}
              onChange={(e) => setChangeForm({ ...changeForm, preferredRoomType: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white"
            >
              <option value="Single Room - AC">Single Room - AC</option>
              <option value="Single Room - Non AC">Single Room - Non AC</option>
              <option value="Double Shared - AC">Double Shared - AC</option>
              <option value="Double Shared - Non AC">Double Shared - Non AC</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reason for Change Request *
            </label>
            <textarea
              rows={3}
              value={changeForm.reason}
              onChange={(e) => setChangeForm({ ...changeForm, reason: e.target.value })}
              placeholder="Explain why you are requesting a room relocation..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
