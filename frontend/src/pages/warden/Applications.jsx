import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  UserCheck,
  AlertCircle,
  Sparkles,
  Filter,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function WardenApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadApplications = () => {
    const list = Store.getApplications();
    setApplications(list);
  };

  useEffect(() => {
    loadApplications();
    window.addEventListener("hms_store_updated", loadApplications);
    return () => window.removeEventListener("hms_store_updated", loadApplications);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDecision = (newStatus) => {
    if (!selectedApp) return;
    setIsLoading(true);
    setTimeout(() => {
      const updatedTimeline = [
        ...selectedApp.timeline,
        {
          title: `Application ${newStatus}`,
          date: new Date().toLocaleString(),
          status: "COMPLETED",
          remarks: remarks || `Status changed to ${newStatus} by Warden.`,
        },
      ];

      Store.saveApplication({
        ...selectedApp,
        status: newStatus,
        remarks: remarks || selectedApp.remarks,
        timeline: updatedTimeline,
      });

      setIsLoading(false);
      setShowDetailModal(false);
      setRemarks("");
      loadApplications();
      showToast(`Application ${selectedApp.id} updated to ${newStatus}!`);
    }, 700);
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === "ALL") return true;
    return app.status === statusFilter;
  });

  const columns = [
    { header: "App Number", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Student Name", accessor: "fullName", render: (r) => <span className="font-bold text-slate-900">{r.fullName} ({r.rollNo})</span> },
    { header: "Course / Branch", render: (r) => <span>{r.course} ({r.branch})</span> },
    { header: "Category", accessor: "category" },
    { header: "Preference", render: (r) => <span className="text-xs font-medium text-slate-700">{r.hostelPreference} ({r.roomTypePreference})</span> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Action",
      render: (r) => (
        <button
          onClick={() => {
            setSelectedApp(r);
            setRemarks(r.remarks || "");
            setShowDetailModal(true);
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
        >
          <Eye size={14} /> Review
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
          <h1 className="text-2xl font-bold text-slate-900">Student Hostel Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review applicant profiles, uploaded certificates, approve, reject, or place on waitlist.
          </p>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["ALL", "SUBMITTED", "UNDER REVIEW", "APPROVED", "WAITLISTED", "REJECTED", "ALLOCATED"].map((st) => (
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

      {/* Applications Table */}
      <DataTable
        columns={columns}
        data={filteredApps}
        searchPlaceholder="Search applicant by name, roll no, or ID..."
        searchKey="fullName"
        emptyMessage="No applications matching criteria."
      />

      {/* Application Review Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Application Review: ${selectedApp?.id}`}>
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedApp.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedApp.rollNo} · {selectedApp.course} ({selectedApp.year})</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Category & CGPA</span>
                <span className="font-bold text-slate-800">{selectedApp.category} (CGPA: {selectedApp.cgpa})</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Contact Phone</span>
                <span className="font-bold text-slate-800">{selectedApp.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Guardian Phone</span>
                <span className="font-bold text-slate-800">{selectedApp.emergencyContact?.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Hostel Choice</span>
                <span className="font-bold text-slate-800">{selectedApp.hostelPreference}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Room Preference</span>
                <span className="font-bold text-slate-800">{selectedApp.roomTypePreference}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block">Submission Date</span>
                <span className="font-bold text-slate-800">{selectedApp.submissionDate}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Submitted Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span>ID Proof: <b>{selectedApp.documents?.idProof || "Not Uploaded"}</b></span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span>Admission: <b>{selectedApp.documents?.admissionLetter || "Not Uploaded"}</b></span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* Warden Action Section */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Warden Decision Remarks</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter verification notes, allocation criteria, or rejection reason..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleDecision("REJECTED")}
                  disabled={isLoading}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleDecision("WAITLISTED")}
                  disabled={isLoading}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md transition"
                >
                  Place on Waitlist
                </button>
                <button
                  onClick={() => handleDecision("APPROVED")}
                  disabled={isLoading}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
