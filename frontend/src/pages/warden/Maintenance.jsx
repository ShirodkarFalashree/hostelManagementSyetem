import React, { useState, useEffect } from "react";
import { Wrench, CheckCircle2, Clock, Sparkles } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function WardenMaintenance() {
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    const load = () => setWorkOrders(Store.getWorkOrders());
    load();
    window.addEventListener("hms_store_updated", load);
    return () => window.removeEventListener("hms_store_updated", load);
  }, []);

  const columns = [
    { header: "Work Order ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Ref Complaint", accessor: "complaintId" },
    { header: "Title & Location", render: (r) => <span className="font-bold text-slate-900">{r.title} ({r.roomNo})</span> },
    { header: "Category", accessor: "category" },
    { header: "Assigned Staff", accessor: "assignedStaff" },
    { header: "Priority", accessor: "priority" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Work Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track active maintenance jobs, work order status, and staff completion notes.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={workOrders}
        searchPlaceholder="Search work orders..."
        searchKey="title"
        emptyMessage="No active work orders."
      />
    </div>
  );
}
