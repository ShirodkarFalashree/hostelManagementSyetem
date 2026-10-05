import React, { useState, useEffect } from "react";
import { Users, LogIn, LogOut, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StaffVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadVisitors = () => setVisitors(Store.getVisitors());

  useEffect(() => {
    loadVisitors();
    window.addEventListener("hms_store_updated", loadVisitors);
    return () => window.removeEventListener("hms_store_updated", loadVisitors);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCheckIn = (vId) => {
    setIsLoading(true);
    setTimeout(() => {
      Store.updateVisitor(vId, {
        status: "IN_PREMISES",
        actualCheckIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsLoading(false);
      loadVisitors();
      showToast(`Visitor ${vId} Checked IN successfully!`);
    }, 500);
  };

  const handleCheckOut = (vId) => {
    setIsLoading(true);
    setTimeout(() => {
      Store.updateVisitor(vId, {
        status: "CHECKED_OUT",
        actualCheckOut: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsLoading(false);
      loadVisitors();
      showToast(`Visitor ${vId} Checked OUT successfully!`);
    }, 500);
  };

  const columns = [
    { header: "Pass ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Visitor", accessor: "visitorName", render: (r) => <span className="font-bold text-slate-900">{r.visitorName} ({r.relation})</span> },
    { header: "ID Proof", render: (r) => <span className="text-xs font-medium">{r.idType} ({r.idNumber})</span> },
    { header: "Visiting Student", render: (r) => <span className="font-semibold text-slate-800">{r.studentName} ({r.roomNo})</span> },
    { header: "Scheduled Date", accessor: "visitDate" },
    { header: "Check In / Out", render: (r) => <span className="text-xs font-semibold">{r.actualCheckIn} / {r.actualCheckOut}</span> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Gate Action",
      render: (r) => (
        <div className="flex gap-2">
          {r.status === "APPROVED" && (
            <button
              onClick={() => handleCheckIn(r.id)}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              <LogIn size={14} /> Check IN
            </button>
          )}
          {r.status === "IN_PREMISES" && (
            <button
              onClick={() => handleCheckOut(r.id)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
            >
              <LogOut size={14} /> Check OUT
            </button>
          )}
          {r.status === "CHECKED_OUT" && <span className="text-xs text-slate-400 font-medium">Completed</span>}
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
          <h1 className="text-2xl font-bold text-slate-900">Security Gate Visitor Check In / Out</h1>
          <p className="mt-1 text-sm text-slate-500">
            Verify visitor identity documents, issue entry passes, and stamp gate departure times.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visitors}
        searchPlaceholder="Search visitor pass by ID, name or student..."
        searchKey="visitorName"
        emptyMessage="No visitors scheduled for check-in."
      />
    </div>
  );
}
