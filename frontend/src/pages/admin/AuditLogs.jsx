import React, { useState, useEffect } from "react";
import { ShieldAlert, Search, Filter, Clock } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function AdminAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    const load = () => setAuditLogs(Store.getAuditLogs());
    load();
    window.addEventListener("hms_store_updated", load);
    return () => window.removeEventListener("hms_store_updated", load);
  }, []);

  const filteredLogs = auditLogs.filter((l) => {
    if (categoryFilter === "ALL") return true;
    return l.category === categoryFilter;
  });

  const columns = [
    { header: "Log ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "User & Role", render: (r) => <div><span className="font-bold text-slate-900 block">{r.user}</span><span className="text-[10px] text-slate-400 font-semibold">{r.role}</span></div> },
    { header: "Action Description", accessor: "action", render: (r) => <span className="font-semibold text-slate-800">{r.action}</span> },
    { header: "Category", accessor: "category", render: (r) => <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{r.category}</span> },
    { header: "Timestamp", accessor: "timestamp" },
    { header: "IP Address", accessor: "ip", render: (r) => <span className="text-xs font-mono text-slate-500">{r.ip}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Audit Trail & Event Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Immutable system audit log tracking security events, role changes, room allocations, and fee payments.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["ALL", "APPLICATION", "ROOM", "PAYMENT", "VISITOR", "COMPLAINT", "USER"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              categoryFilter === cat
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search audit logs by action or user..."
        searchKey="action"
        emptyMessage="No audit log events recorded."
      />
    </div>
  );
}
