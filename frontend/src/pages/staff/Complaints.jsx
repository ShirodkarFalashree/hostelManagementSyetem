import React, { useState, useEffect } from "react";
import { MessageSquareWarning, Eye, Sparkles } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StaffComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const load = () => setComplaints(Store.getComplaints());
    load();
    window.addEventListener("hms_store_updated", load);
    return () => window.removeEventListener("hms_store_updated", load);
  }, []);

  const columns = [
    { header: "Complaint ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Location & Student", render: (r) => <span className="font-bold text-slate-900">Room {r.roomNo} ({r.studentName})</span> },
    { header: "Category", accessor: "category" },
    { header: "Title", accessor: "title" },
    { header: "Priority", accessor: "priority" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Assigned Complaints</h1>
          <p className="mt-1 text-sm text-slate-500">
            View student service tickets directly assigned to your maintenance team.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={complaints}
        searchPlaceholder="Search assigned complaints..."
        searchKey="title"
        emptyMessage="No assigned complaints."
      />
    </div>
  );
}
