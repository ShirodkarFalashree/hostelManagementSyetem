import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, UserCheck } from "lucide-react";
import { Store } from "../../services/store";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("falashree@university.edu");
  const [password, setPassword] = useState("Password@123");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "student") {
      setEmail("falashree@university.edu");
    } else if (selectedRole === "warden") {
      setEmail("warden.b@university.edu");
    } else if (selectedRole === "staff") {
      setEmail("rajesh.staff@university.edu");
    } else if (selectedRole === "admin") {
      setEmail("admin@university.edu");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) {
      setErrorMsg("Account temporarily locked due to 3 failed attempts. Please try again later or reset password.");
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Simulate login verification
    if (password === "wrongpassword") {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        setIsLocked(true);
        setErrorMsg("Account locked! 3 failed login attempts detected.");
        Store.addAuditLog("Unknown", "Failed Login Lockout (" + email + ")", "USER");
      } else {
        setErrorMsg(`Invalid password. ${3 - attempts} attempt(s) remaining.`);
      }
      return;
    }

    // Successful Login
    Store.addAuditLog(email, `Logged in as ${role.toUpperCase()}`, "USER");
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">HostelHub Portal</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sign in to your dashboard</p>
        </div>

        {/* Role Switcher Demo */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            Quick Select Role (Demo Preset)
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {["student", "warden", "staff", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 text-xs font-bold capitalize rounded-xl transition ${
                  role === r ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Error / Lockout Alert */}
        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700 flex items-start gap-2">
            <ShieldAlert size={18} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLocked}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs text-slate-900 focus:border-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-slate-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-xs text-slate-900 focus:border-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 shadow-md transition disabled:opacity-50"
          >
            Sign In to {role.toUpperCase()} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-400">Hostel Management System v2.5 · Enterprise Edition</p>
        </div>
      </div>
    </div>
  );
}
