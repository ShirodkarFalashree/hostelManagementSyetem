import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-4">
        <ShieldAlert size={48} className="text-rose-500 mx-auto" />
        <h1 className="text-2xl font-extrabold text-slate-900">403 - Access Denied</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          You do not have administrative clearance or permissions to view this module.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800"
        >
          <ArrowLeft size={16} /> Return to Login
        </Link>
      </div>
    </div>
  );
}
