import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500">Create a new secure password for your account.</p>
        </div>

        {error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-bold">{error}</div>}

        {done ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-slate-900">Password Updated Successfully!</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              Sign In with New Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 shadow-md"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
