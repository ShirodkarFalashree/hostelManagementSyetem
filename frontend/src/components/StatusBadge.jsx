import React from "react";

const statusStyles = {
  // Application / Request Statuses
  DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  "UNDER REVIEW": "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  WAITLISTED: "bg-purple-50 text-purple-700 border-purple-200",
  ALLOCATED: "bg-indigo-50 text-indigo-700 border-indigo-200",

  // Complaint / Maintenance Statuses
  OPEN: "bg-amber-50 text-amber-700 border-amber-200",
  ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-sky-50 text-sky-700 border-sky-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DISPUTED: "bg-orange-50 text-orange-700 border-orange-200",
  CLOSED: "bg-slate-100 text-slate-700 border-slate-300",

  // Visitor Statuses
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_PREMISES: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CHECKED_OUT: "bg-slate-100 text-slate-700 border-slate-300",

  // Room / Bed Statuses
  AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OCCUPIED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  MAINTENANCE: "bg-rose-50 text-rose-700 border-rose-200",
  BLOCKED: "bg-slate-200 text-slate-700 border-slate-300",

  // General Statuses
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-300",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OVERDUE: "bg-rose-50 text-rose-700 border-rose-200",
  UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function StatusBadge({ status, className = "" }) {
  if (!status) return null;
  const formattedStatus = String(status).toUpperCase();
  const style = statusStyles[formattedStatus] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </span>
  );
}
