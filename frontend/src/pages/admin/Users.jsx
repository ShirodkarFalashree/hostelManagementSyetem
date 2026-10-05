import React, { useState, useEffect } from "react";
import { Users, Plus, Shield, CheckCircle2, XCircle, KeyRound, Edit, Sparkles, UserX } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student",
    department: "Computer Science",
    password: "Password@123",
  });

  const loadUsers = () => setUsers(Store.getUsers());

  useEffect(() => {
    loadUsers();
    window.addEventListener("hms_store_updated", loadUsers);
    return () => window.removeEventListener("hms_store_updated", loadUsers);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newUser = {
        id: `USR-0${Math.floor(10 + Math.random() * 90)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "+91 9800000000",
        role: formData.role,
        department: formData.department,
        status: "Active",
      };

      Store.addUser(newUser);
      setIsLoading(false);
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", role: "Student", department: "Computer Science", password: "Password@123" });
      loadUsers();
      showToast(`User ${newUser.name} (${newUser.role}) created successfully!`);
    }, 600);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    Store.updateUser(id, { status: newStatus });
    loadUsers();
    showToast(`User status updated to ${newStatus}`);
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    return u.role === roleFilter;
  });

  const columns = [
    { header: "User ID", accessor: "id", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.id}</span> },
    { header: "Name & Email", render: (r) => <div><span className="font-bold text-slate-900 block">{r.name}</span><span className="text-xs text-slate-400">{r.email}</span></div> },
    { header: "Role", accessor: "role", render: (r) => <span className="font-extrabold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{r.role}</span> },
    { header: "Department / Wing", accessor: "department" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus(r.id, r.status)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              r.status === "Active" ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {r.status === "Active" ? "Deactivate" : "Activate"}
          </button>
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
          <h1 className="text-2xl font-bold text-slate-900">User Account Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create system accounts, assign RBAC permissions, reset credentials, and activate/deactivate users.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
        >
          <Plus size={16} /> Create New User
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["ALL", "Student", "Warden", "Staff", "Admin"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              roleFilter === r
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search users by name or email..."
        searchKey="name"
        emptyMessage="No user accounts match criteria."
      />

      {/* Create User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New System User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assign Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Student">Student</option>
                <option value="Warden">Warden</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Department / Wing</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
              />
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
              {isLoading ? "Creating..." : "Save User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
