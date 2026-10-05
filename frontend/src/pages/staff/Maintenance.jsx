import React, { useState, useEffect } from "react";
import { Wrench, CheckCircle2, Clock, Sparkles, Play, FileCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StaffMaintenance() {
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWO, setSelectedWO] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [proofImage, setProofImage] = useState("completion_proof.jpg");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    const list = Store.getWorkOrders();
    setWorkOrders(list);
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

  const handleStartJob = (woId) => {
    setIsLoading(true);
    setTimeout(() => {
      Store.updateWorkOrder(woId, { status: "IN_PROGRESS" });
      setIsLoading(false);
      loadData();
      showToast(`Work order ${woId} started!`);
    }, 500);
  };

  const handleMarkComplete = (e) => {
    e.preventDefault();
    if (!selectedWO) return;

    setIsLoading(true);
    setTimeout(() => {
      // Update Work Order
      Store.updateWorkOrder(selectedWO.id, {
        status: "COMPLETED",
        notes: notes || "Work finished cleanly.",
        proofImage: proofImage,
      });

      // Update linked complaint
      if (selectedWO.complaintId) {
        const complaints = Store.getComplaints();
        const targetCmp = complaints.find((c) => c.id === selectedWO.complaintId);
        if (targetCmp) {
          Store.updateComplaint(targetCmp.id, {
            status: "RESOLVED",
            resolutionNotes: notes || "Work completed by staff.",
            updatedAt: new Date().toLocaleString(),
            timeline: [
              ...targetCmp.timeline,
              { title: "Resolved by Staff", date: new Date().toLocaleString(), status: "COMPLETED", remarks: notes },
            ],
          });
        }
      }

      setIsLoading(false);
      setShowUpdateModal(false);
      setNotes("");
      loadData();
      showToast(`Work order ${selectedWO.id} completed & marked RESOLVED!`);
    }, 700);
  };

  const columns = [
    { header: "Work Order ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Location & Title", render: (r) => <span className="font-bold text-slate-900">Room {r.roomNo} - {r.title}</span> },
    { header: "Category", accessor: "category" },
    { header: "Priority", accessor: "priority", render: (r) => <span className="font-extrabold text-xs">{r.priority}</span> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Action",
      render: (r) => (
        <div className="flex gap-2">
          {r.status === "ASSIGNED" && (
            <button
              onClick={() => handleStartJob(r.id)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Play size={14} /> Start Job
            </button>
          )}
          {r.status === "IN_PROGRESS" && (
            <button
              onClick={() => {
                setSelectedWO(r);
                setNotes(r.notes || "");
                setShowUpdateModal(true);
              }}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              <FileCheck size={14} /> Mark Completed
            </button>
          )}
          {r.status === "COMPLETED" && <span className="text-xs text-emerald-600 font-bold">Finished ✓</span>}
        </div>
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
          <h1 className="text-2xl font-bold text-slate-900">Staff Assigned Maintenance Work Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            View active work orders assigned to you, accept jobs, update progress, and submit completion proofs.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={workOrders}
        searchPlaceholder="Search work orders..."
        searchKey="title"
        emptyMessage="No maintenance work orders assigned."
      />

      {/* Complete Work Order Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title={`Complete Work Order: ${selectedWO?.id}`}>
        {selectedWO && (
          <form onSubmit={handleMarkComplete} className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs">
              <span className="font-extrabold text-slate-900 block">{selectedWO.title}</span>
              <p className="text-slate-500 mt-1">Location: Room {selectedWO.roomNo} · Category: {selectedWO.category}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Resolution / Repair Notes *</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain what repair/maintenance work was completed..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Completion Proof Image (Optional)</label>
              <input
                type="text"
                value={proofImage}
                onChange={(e) => setProofImage(e.target.value)}
                placeholder="File name e.g. fixed_tap.jpg"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
              >
                {isLoading ? "Updating..." : "Submit & Resolve Ticket"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
