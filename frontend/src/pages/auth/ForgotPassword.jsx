import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <KeyRound size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
          <p className="text-xs text-slate-500">Enter your registered university email to receive a password reset token.</p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-slate-900">Password Reset Link Sent!</p>
            <p className="text-xs text-slate-500">Please check your inbox at {email} for instructions.</p>
            <Link
              to="/reset-password"
              className="block w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white text-center hover:bg-slate-800"
            >
              Proceed to Reset Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@university.edu"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-extrabold text-white hover:bg-slate-800 shadow-md"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
