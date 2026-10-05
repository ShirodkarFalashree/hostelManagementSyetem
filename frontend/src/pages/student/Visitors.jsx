import React, { useState, useEffect } from "react";
import { Users, Plus, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, UserCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StudentVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    visitorName: "",
    contact: "",
    relation: "Parent",
    idType: "Aadhaar Card",
    idNumber: "",
    visitDate: new Date().toISOString().split("T")[0],
    expectedTime: "04:00 PM",
    purpose: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const loadVisitors = () => {
    const list = Store.getVisitors();
    const myVisitors = list.filter((v) => v.studentId === "STU-1042");
    setVisitors(myVisitors);
  };

  useEffect(() => {
    loadVisitors();
    window.addEventListener("hms_store_updated", loadVisitors);
    return () => window.removeEventListener("hms_store_updated", loadVisitors);
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
    if (!formData.visitorName.trim()) errs.visitorName = "Visitor name is required";
    if (!formData.contact.trim()) errs.contact = "Contact number is required";
    if (!formData.purpose.trim()) errs.purpose = "Purpose of visit is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newVisitor = {
        id: `VIS-2026-${Math.floor(100 + Math.random() * 900)}`,
        studentId: "STU-1042",
        studentName: "Falashree",
        rollNo: "2024CS1042",
        roomNo: "B-203",
        visitorName: formData.visitorName,
        contact: formData.contact,
        relation: formData.relation,
        idType: formData.idType,
        idNumber: formData.idNumber || "Not Specified",
        visitDate: formData.visitDate,
        expectedTime: formData.expectedTime,
        actualCheckIn: "-",
        actualCheckOut: "-",
        purpose: formData.purpose,
        status: "APPROVED", // Auto approved or pending warden review
      };

      Store.addVisitor(newVisitor);
      setIsLoading(false);
      setShowModal(false);
      setFormData({
        visitorName: "",
        contact: "",
        relation: "Parent",
        idType: "Aadhaar Card",
        idNumber: "",
        visitDate: new Date().toISOString().split("T")[0],
        expectedTime: "04:00 PM",
        purpose: "",
      });
      loadVisitors();
      showToast("Visitor pass registered successfully!");
    }, 600);
  };

  const columns = [
    { header: "Visitor Pass ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Visitor Name", accessor: "visitorName", render: (r) => <span className="font-bold text-slate-900">{r.visitorName} ({r.relation})</span> },
    { header: "Contact", accessor: "contact" },
    { header: "Visit Date & Time", render: (r) => <span>{r.visitDate} ({r.expectedTime})</span> },
    { header: "Purpose", accessor: "purpose" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
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
          <h1 className="text-2xl font-bold text-slate-900">Visitor Pass Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Register expected visitors for campus security verification and check-in pass.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <Plus size={16} /> Register Visitor
        </button>
      </div>

      {/* Visitor Table */}
      <DataTable
        columns={columns}
        data={visitors}
        searchPlaceholder="Search visitor history by name or ID..."
        searchKey="visitorName"
        emptyMessage="No visitors registered yet."
      />

      {/* Register Visitor Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register New Visitor Pass">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Visitor Full Name *</label>
              <input
                type="text"
                name="visitorName"
                value={formData.visitorName}
                onChange={handleInputChange}
                className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                  formErrors.visitorName ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                }`}
              />
              {formErrors.visitorName && <p className="mt-1 text-xs text-rose-500">{formErrors.visitorName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                  formErrors.contact ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                }`}
              />
              {formErrors.contact && <p className="mt-1 text-xs text-rose-500">{formErrors.contact}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Relation</label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
                <option value="Friend">Friend / Relative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Govt ID Type</label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Visit Date *</label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Expected Time</label>
              <input
                type="text"
                name="expectedTime"
                value={formData.expectedTime}
                onChange={handleInputChange}
                placeholder="e.g. 04:00 PM"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Visit *</label>
              <textarea
                rows={2}
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Brief reason for visit..."
                className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                  formErrors.purpose ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                }`}
              />
              {formErrors.purpose && <p className="mt-1 text-xs text-rose-500">{formErrors.purpose}</p>}
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
              {isLoading ? "Generating Pass..." : "Create Visitor Pass"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
