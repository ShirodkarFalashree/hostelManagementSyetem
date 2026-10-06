import React, { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] =
    useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setAttemptsRemaining(null);

    if (!email || !password) {
      setErrorMsg(
        "Please enter your email and password."
      );

      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setErrorMsg(result.message);

      if (result.attemptsRemaining) {
        setAttemptsRemaining(
          result.attemptsRemaining
        );
      }

      return;
    }

    // REAL ROLE-BASED REDIRECT
    navigate(`/${result.user.role}/dashboard`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        {/* Header */}

        <div className="space-y-2 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Building2 size={28} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            HostelHub
          </h1>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hostel Management System
          </p>

        </div>

        {/* Error */}

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">

            <ShieldAlert
              size={18}
              className="shrink-0"
            />

            <div>
              <p>{errorMsg}</p>

              {attemptsRemaining && (
                <p className="mt-1">
                  {attemptsRemaining} attempt(s)
                  remaining.
                </p>
              )}
            </div>

          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={17}
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-800"
              />

            </div>
          </div>

          {/* Password */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-bold text-slate-600 hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            <div className="relative">

              <Lock
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={17}
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-800"
              />

            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>

        {/* Register */}

        <div className="border-t border-slate-100 pt-5 text-center">

          <p className="text-sm text-slate-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-bold text-slate-900 hover:underline"
            >
              Register as Student
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}