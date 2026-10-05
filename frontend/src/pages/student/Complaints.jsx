import React, { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Paperclip,
  ThumbsUp,
  HelpCircle,
  Eye,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Rating & Dispute State
  const [rating, setRating] = useState(5);
  const [disputeNotes, setDisputeNotes] = useState("");
  const [isDisputing, setIsDisputing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "Plumbing",
    title: "",
    description: "",
    priority: "Medium",
    attachment: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const loadComplaints = () => {
    const list = Store.getComplaints();
    const myComplaints = list.filter((c) => c.studentId === "STU-1042");
    setComplaints(myComplaints);
  };

  useEffect(() => {
    loadComplaints();
    window.addEventListener("hms_store_updated", loadComplaints);
    return () => window.removeEventListener("hms_store_updated", loadComplaints);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newCmp = {
        id: `CMP-2026-0${Math.floor(20 + Math.random() * 80)}`,
        studentId: "STU-1042",
        studentName: "Falashree",
        rollNo: "2024CS1042",
        roomNo: "B-203",
        category: formData.category,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        attachment: formData.attachment || null,
        status: "OPEN",
        assignedStaff: "Pending Warden Assignment",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        timeline: [
          { title: "Complaint Registered", date: new Date().toLocaleString(), status: "COMPLETED", remarks: "Filed by student" },
          { title: "Pending Staff Assignment", date: "Pending", status: "IN_PROGRESS", remarks: "Warden notified" },
        ],
      };

      Store.addComplaint(newCmp);
      setIsLoading(false);
      setShowCreateModal(false);
      setFormData({ category: "Plumbing", title: "", description: "", priority: "Medium", attachment: "" });
      loadComplaints();
      showToast("Complaint registered successfully!");
    }, 700);
  };

  const handleConfirmResolution = () => {
    if (!selectedComplaint) return;
    setIsLoading(true);
    setTimeout(() => {
      Store.updateComplaint(selectedComplaint.id, {
        status: "CLOSED",
        rating: rating,
        updatedAt: new Date().toLocaleString(),
        timeline: [
          ...selectedComplaint.timeline,
          { title: "Resolution Confirmed", date: new Date().toLocaleString(), status: "COMPLETED", remarks: `Rated ${rating}/5 stars` },
        ],
      });
      setIsLoading(false);
      setShowDetailModal(false);
      loadComplaints();
      showToast("Resolution confirmed. Thank you for rating!");
    }, 600);
  };

  const handleRaiseDispute = () => {
    if (!disputeNotes.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      Store.updateComplaint(selectedComplaint.id, {
        status: "DISPUTED",
        disputeNotes: disputeNotes,
        updatedAt: new Date().toLocaleString(),
        timeline: [
          ...selectedComplaint.timeline,
          { title: "Dispute Raised", date: new Date().toLocaleString(), status: "COMPLETED", remarks: disputeNotes },
        ],
      });
      setIsLoading(false);
      setIsDisputing(false);
      setShowDetailModal(false);
      loadComplaints();
      showToast("Dispute submitted to Warden for review.");
    }, 600);
  };

  const columns = [
    { header: "Ticket ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Category", accessor: "category", render: (r) => <span className="font-semibold text-slate-800">{r.category}</span> },
    { header: "Title & Issue", accessor: "title", render: (r) => <span className="font-bold text-slate-900 block">{r.title}</span> },
    {
      header: "Priority",
      accessor: "priority",
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            r.priority === "Urgent" || r.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
          }`}
        >
          {r.priority}
        </span>
      ),
    },
    { header: "Assigned Staff", accessor: "assignedStaff" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      render: (r) => (
        <button
          onClick={() => {
            setSelectedComplaint(r);
            setShowDetailModal(true);
            setIsDisputing(false);
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
        >
          <Eye size={14} /> Details
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
          <h1 className="text-2xl font-bold text-slate-900">Complaints & Maintenance</h1>
          <p className="mt-1 text-sm text-slate-500">
            Log maintenance issues, track live staff resolution progress, and rate completed work.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <Plus size={16} /> Log New Complaint
        </button>
      </div>

      {/* Complaints Table */}
      <DataTable
        columns={columns}
        data={complaints}
        searchPlaceholder="Search complaints by ID, title, or category..."
        searchKey="title"
        emptyMessage="No complaints registered."
      />

      {/* Create Complaint Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Register Complaint Ticket">
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Furniture">Furniture & Woodwork</option>
                <option value="Cleanliness">Cleanliness & Hygiene</option>
                <option value="Wi-Fi">Wi-Fi & Network</option>
                <option value="Food/Mess">Food / Mess Quality</option>
                <option value="Noise">Noise / Discipline</option>
                <option value="Other">Other Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent (Immediate Action)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Complaint Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief summary e.g. Bathroom tap leaking"
                className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                  formErrors.title ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                }`}
              />
              {formErrors.title && <p className="mt-1 text-xs text-rose-500">{formErrors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description *</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue, location in room, time observed..."
                className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                  formErrors.description ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                }`}
              />
              {formErrors.description && <p className="mt-1 text-xs text-rose-500">{formErrors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Attachment Name (Optional)</label>
              <input
                type="text"
                name="attachment"
                value={formData.attachment}
                onChange={handleInputChange}
                placeholder="e.g. photo_leakage.jpg"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md"
            >
              {isLoading ? "Filing Ticket..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Complaint Detail & Resolution Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Complaint Ticket: ${selectedComplaint?.id}`}>
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedComplaint.title}</h3>
                <span className="text-xs text-slate-500">{selectedComplaint.category} · Room {selectedComplaint.roomNo}</span>
              </div>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="text-slate-800 leading-relaxed font-medium">"{selectedComplaint.description}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500">
                <span>Priority: <b>{selectedComplaint.priority}</b></span>
                <span>Assigned Staff: <b>{selectedComplaint.assignedStaff}</b></span>
              </div>
            </div>

            {/* Resolution Confirmation Box if RESOLVED */}
            {selectedComplaint.status === "RESOLVED" && !isDisputing && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 size={18} /> Staff marked this complaint as RESOLVED.
                </div>
                {selectedComplaint.resolutionNotes && (
                  <p className="text-xs text-emerald-900 italic">"{selectedComplaint.resolutionNotes}"</p>
                )}

                <div className="space-y-2 border-t border-emerald-200 pt-3">
                  <label className="block text-xs font-bold text-emerald-900">Rate Staff Service:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition ${rating >= star ? "text-amber-500" : "text-slate-300"}`}
                      >
                        <Star size={22} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setIsDisputing(true)}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Not Satisfied? Raise Dispute
                  </button>
                  <button
                    onClick={handleConfirmResolution}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
                  >
                    Accept & Close Ticket
                  </button>
                </div>
              </div>
            )}

            {/* Dispute Form */}
            {isDisputing && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 space-y-3">
                <h4 className="text-xs font-bold text-rose-800">Raise Dispute to Warden</h4>
                <textarea
                  rows={2}
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  placeholder="Explain why the work is incomplete or unsatisfactory..."
                  className="w-full rounded-xl border border-rose-300 p-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsDisputing(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRaiseDispute}
                    className="rounded-lg bg-rose-600 text-white px-4 py-1.5 text-xs font-bold hover:bg-rose-700"
                  >
                    Submit Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
