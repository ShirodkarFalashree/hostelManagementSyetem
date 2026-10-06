import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    const result = await register(
      form.name,
      form.email,
      form.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/student/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Building2 size={27} />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            Create Account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Register for HostelHub
          </p>

        </div>

        {error && (
          <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">

            <ShieldAlert
              size={18}
              className="shrink-0"
            />

            {error}

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Name */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">
              Full Name
            </label>

            <div className="relative">

              <User
                size={17}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-800"
              />

            </div>

          </div>

          {/* Email */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">
              University Email
            </label>

            <div className="relative">

              <Mail
                size={17}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-800"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">
              Password
            </label>

            <div className="relative">

              <Lock
                size={17}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-800"
              />

            </div>

          </div>

          {/* Confirm */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-800"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create Student Account"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>

        <p className="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-bold text-slate-900 hover:underline"
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}