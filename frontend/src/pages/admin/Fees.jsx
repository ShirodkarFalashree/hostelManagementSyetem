import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Save, Sparkles, DollarSign } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function AdminFees() {
  const [feeStructures, setFeeStructures] = useState([
    { id: "FS-2026-AUTUMN", academicYear: "2026-2027", term: "Autumn Semester", hostelFee: 28000, messFee: 15000, deposit: 5000, dueDate: "2026-10-15", lateFeePerDay: 100 },
    { id: "FS-2026-SPRING", academicYear: "2026-2027", term: "Spring Semester", hostelFee: 28000, messFee: 15000, deposit: 0, dueDate: "2027-02-15", lateFeePerDay: 100 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newFS, setNewFS] = useState({
    term: "Summer Term",
    academicYear: "2026-2027",
    hostelFee: 15000,
    messFee: 8000,
    deposit: 0,
    dueDate: "2027-06-15",
    lateFeePerDay: 50,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateFS = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const created = {
        id: `FS-2026-${newFS.term.toUpperCase().replace(" ", "")}`,
        ...newFS,
        hostelFee: Number(newFS.hostelFee),
        messFee: Number(newFS.messFee),
        deposit: Number(newFS.deposit),
        lateFeePerDay: Number(newFS.lateFeePerDay),
      };

      setFeeStructures([created, ...feeStructures]);
      setIsLoading(false);
      setShowModal(false);
      showToast(`Fee Structure ${created.id} defined!`);
    }, 600);
  };

  const columns = [
    { header: "Structure ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Academic Term", render: (r) => <span className="font-bold text-slate-900">{r.term} ({r.academicYear})</span> },
    { header: "Hostel Fee", accessor: "hostelFee", render: (r) => <span>₹{r.hostelFee.toLocaleString()}</span> },
    { header: "Mess Fee", accessor: "messFee", render: (r) => <span>₹{r.messFee.toLocaleString()}</span> },
    { header: "Security Deposit", accessor: "deposit", render: (r) => <span>₹{r.deposit.toLocaleString()}</span> },
    { header: "Due Date", accessor: "dueDate", render: (r) => <span className="font-bold text-rose-600">{r.dueDate}</span> },
    { header: "Late Fee / Day", accessor: "lateFeePerDay", render: (r) => <span>₹{r.lateFeePerDay}</span> },
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
          <h1 className="text-2xl font-bold text-slate-900">Fee Structure Configuration</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define term fees, mess rates, refundable security deposits, category waivers, and late fee rates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <Plus size={16} /> Define Fee Structure
        </button>
      </div>

      <DataTable
        columns={columns}
        data={feeStructures}
        searchPlaceholder="Search fee structures..."
        searchKey="term"
        emptyMessage="No fee structures defined."
      />

      {/* Define Fee Structure Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Define New Term Fee Structure">
        <form onSubmit={handleCreateFS} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Term Title *</label>
              <input
                type="text"
                value={newFS.term}
                onChange={(e) => setNewFS({ ...newFS, term: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Academic Year</label>
              <input
                type="text"
                value={newFS.academicYear}
                onChange={(e) => setNewFS({ ...newFS, academicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hostel Rent Fee (₹)</label>
              <input
                type="number"
                value={newFS.hostelFee}
                onChange={(e) => setNewFS({ ...newFS, hostelFee: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mess Fee (₹)</label>
              <input
                type="number"
                value={newFS.messFee}
                onChange={(e) => setNewFS({ ...newFS, messFee: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Due Date</label>
              <input
                type="date"
                value={newFS.dueDate}
                onChange={(e) => setNewFS({ ...newFS, dueDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Late Fee Rate per Day (₹)</label>
              <input
                type="number"
                value={newFS.lateFeePerDay}
                onChange={(e) => setNewFS({ ...newFS, lateFeePerDay: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              {isLoading ? "Saving..." : "Save Fee Structure"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
