import React, { useState, useEffect } from "react";
import { BarChart3, Download, Printer, Filter, Calendar, Sparkles, PieChart as PieIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { Store } from "../../services/store";

const COLORS = ["#0f172a", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6"];

export default function AdminReports() {
  const [reportType, setReportType] = useState("OCCUPANCY"); // OCCUPANCY, APPLICATIONS, FEES, COMPLAINTS, VISITORS
  const [data, setData] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [reportType]);

  const loadReportData = () => {
    if (reportType === "OCCUPANCY") {
      setData(Store.getRooms());
    } else if (reportType === "APPLICATIONS") {
      setData(Store.getApplications());
    } else if (reportType === "FEES") {
      setData(Store.getFees());
    } else if (reportType === "COMPLAINTS") {
      setData(Store.getComplaints());
    } else if (reportType === "VISITORS") {
      setData(Store.getVisitors());
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(",")];
    data.forEach((row) => {
      const values = keys.map((k) => `"${String(row[k] || "").replace(/"/g, '""')}"`);
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Hostel_${reportType}_Report.csv`;
    a.click();
    showToast(`Exported ${reportType} report to Excel CSV!`);
  };

  // Recharts Summary Data
  const occupancyChartData = [
    { name: "Block A", Occupied: 3, Vacant: 2 },
    { name: "Block B", Occupied: 3, Vacant: 1 },
    { name: "Block C", Occupied: 1, Vacant: 4 },
  ];

  const statusPieData = [
    { name: "Allocated", value: 1 },
    { name: "Submitted", value: 1 },
    { name: "Waitlisted", value: 1 },
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
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Report Generator</h1>
          <p className="mt-1 text-sm text-slate-500">
            Generate printable audit reports, export raw datasets to Excel CSV, and inspect visual metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Printer size={16} /> Export PDF Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
          >
            <Download size={16} /> Export Excel CSV
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "OCCUPANCY", label: "Occupancy Report" },
          { key: "APPLICATIONS", label: "Applications Report" },
          { key: "FEES", label: "Fees & Dues Report" },
          { key: "COMPLAINTS", label: "Complaints Audit" },
          { key: "VISITORS", label: "Visitor Register" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              reportType === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Block-wise Capacity Breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="Occupied" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Vacant" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Application Distribution Ratio</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Data Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Report Data Table ({data.length} Records)</h2>
        </div>

        <DataTable
          columns={[
            { header: "Record ID", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id || r.transactionId}</span> },
            { header: "Primary Field", render: (r) => <span className="font-bold text-slate-800">{r.fullName || r.roomNumber || r.visitorName || r.title}</span> },
            { header: "Category / Type", render: (r) => <span>{r.category || r.roomType || r.hostel || "General"}</span> },
            { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          data={data}
          searchPlaceholder="Filter report table..."
          emptyMessage="No report data."
        />
      </div>
    </div>
  );
}
