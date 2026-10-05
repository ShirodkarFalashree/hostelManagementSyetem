import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Sparkles, CheckCircle2, UserCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function WardenVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const load = () => setVisitors(Store.getVisitors());
    load();
    window.addEventListener("hms_store_updated", load);
    return () => window.removeEventListener("hms_store_updated", load);
  }, []);

  const filteredVisitors = visitors.filter((v) => {
    if (statusFilter === "ALL") return true;
    return v.status === statusFilter;
  });

  const activeInPremises = visitors.filter((v) => v.status === "IN_PREMISES").length;

  const columns = [
    { header: "Pass ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Visitor Name", accessor: "visitorName", render: (r) => <span className="font-bold text-slate-900">{r.visitorName} ({r.relation})</span> },
    { header: "Student", render: (r) => <span className="font-semibold text-slate-800">{r.studentName} ({r.roomNo})</span> },
    { header: "Contact", accessor: "contact" },
    { header: "Visit Date & Time", render: (r) => <span>{r.visitDate} ({r.expectedTime})</span> },
    { header: "Entry / Exit", render: (r) => <span className="text-xs">{r.actualCheckIn} / {r.actualCheckOut}</span> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Visitor Logs & Security</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor expected guest entries, verify student visitor permissions, and track active campus visits.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-emerald-800 text-xs font-bold">
          <UserCheck size={16} /> Active in Premises: {activeInPremises} Visitors
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["ALL", "APPROVED", "IN_PREMISES", "CHECKED_OUT", "PENDING", "REJECTED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              statusFilter === st
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredVisitors}
        searchPlaceholder="Search visitor logs by student name or visitor..."
        searchKey="visitorName"
        emptyMessage="No visitor logs match."
      />
    </div>
  );
}
