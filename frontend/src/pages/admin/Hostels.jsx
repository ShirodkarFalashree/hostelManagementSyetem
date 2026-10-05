import React, { useState, useEffect } from "react";
import { Building2, Plus, BedDouble, Wrench, CheckCircle2, Sparkles } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function AdminHostels() {
  const [rooms, setRooms] = useState([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newRoom, setNewRoom] = useState({
    hostel: "Hostel B (Girls Hostel)",
    block: "Block B",
    floor: "3rd Floor",
    roomNumber: "B-301",
    roomType: "Double Shared - AC",
    capacity: 2,
  });

  const loadRooms = () => setRooms(Store.getRooms());

  useEffect(() => {
    loadRooms();
    window.addEventListener("hms_store_updated", loadRooms);
    return () => window.removeEventListener("hms_store_updated", loadRooms);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleMaintenance = (roomId, currentStatus) => {
    const target = rooms.find((r) => r.id === roomId);
    if (!target) return;
    const newStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
    Store.updateRoom({ ...target, status: newStatus });
    loadRooms();
    showToast(`Room ${target.roomNumber} status set to ${newStatus}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const createdRoom = {
        id: `ROOM-${newRoom.roomNumber.replace("-", "")}`,
        hostel: newRoom.hostel,
        block: newRoom.block,
        floor: newRoom.floor,
        roomNumber: newRoom.roomNumber,
        roomType: newRoom.roomType,
        capacity: Number(newRoom.capacity),
        occupancy: 0,
        status: "AVAILABLE",
        amenities: ["Wi-Fi", "Study Desks", "Wardrobes"],
        beds: Array.from({ length: Number(newRoom.capacity) }, (_, i) => ({
          bedNo: `Bed-${i + 1}`,
          status: "AVAILABLE",
          student: null,
        })),
      };

      const list = Store.getRooms();
      Store.updateRoom(createdRoom); // or save
      setIsLoading(false);
      setShowAddRoomModal(false);
      loadRooms();
      showToast(`Created Room ${createdRoom.roomNumber} with ${createdRoom.capacity} beds!`);
    }, 600);
  };

  const columns = [
    { header: "Room Number", accessor: "roomNumber", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.roomNumber}</span> },
    { header: "Hostel & Block", render: (r) => <span>{r.hostel} ({r.block})</span> },
    { header: "Floor", accessor: "floor" },
    { header: "Room Type", accessor: "roomType" },
    { header: "Beds Capacity", render: (r) => <span className="font-bold text-slate-900">{r.occupancy} / {r.capacity} Beds</span> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Maintenance Toggle",
      render: (r) => (
        <button
          onClick={() => handleToggleMaintenance(r.id, r.status)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
            r.status === "MAINTENANCE"
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
        >
          {r.status === "MAINTENANCE" ? "Unblock Room" : "Block Maintenance"}
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
          <h1 className="text-2xl font-bold text-slate-900">Hostel Infrastructure Configuration</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure hostel blocks, floors, rooms, capacity, and maintenance status blocks.
          </p>
        </div>

        <button
          onClick={() => setShowAddRoomModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <Plus size={16} /> Add Room Inventory
        </button>
      </div>

      <DataTable
        columns={columns}
        data={rooms}
        searchPlaceholder="Search hostel rooms by number or block..."
        searchKey="roomNumber"
        emptyMessage="No hostel rooms configured."
      />

      {/* Add Room Modal */}
      <Modal isOpen={showAddRoomModal} onClose={() => setShowAddRoomModal(false)} title="Configure New Room Inventory">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hostel *</label>
              <select
                value={newRoom.hostel}
                onChange={(e) => setNewRoom({ ...newRoom, hostel: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Hostel A (Boys Hostel)">Hostel A (Boys Hostel)</option>
                <option value="Hostel B (Girls Hostel)">Hostel B (Girls Hostel)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Block *</label>
              <input
                type="text"
                value={newRoom.block}
                onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Room Number *</label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Room Capacity (Beds)</label>
              <input
                type="number"
                min={1}
                max={4}
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Room Type</label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Single Room - AC">Single Room - AC</option>
                <option value="Single Room - Non AC">Single Room - Non AC</option>
                <option value="Double Shared - AC">Double Shared - AC</option>
                <option value="Double Shared - Non AC">Double Shared - Non AC</option>
                <option value="Triple Shared - Non AC">Triple Shared - Non AC</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddRoomModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              {isLoading ? "Saving..." : "Create Room"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
