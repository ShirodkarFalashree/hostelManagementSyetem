import {
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  Users,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function StudentDashboard() {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good evening 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your hostel today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Room"
          value="A-203"
          description="Block A · 2nd Floor"
          icon={BedDouble}
        />

        <StatCard
          title="Fee Due"
          value="₹12,000"
          description="Due on 15 Oct"
          icon={CreditCard}
        />

        <StatCard
          title="Complaints"
          value="2"
          description="1 currently in progress"
          icon={MessageSquareWarning}
        />

        <StatCard
          title="Visitors"
          value="3"
          description="This month"
          icon={Users}
        />

      </div>

      {/* Main content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Hostel Application
              </h2>

              <p className="text-sm text-slate-500">
                Current application status
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              Approved
            </span>
          </div>

          <div className="space-y-5">

            {[
              ["Application Submitted", true],
              ["Application Reviewed", true],
              ["Application Approved", true],
              ["Room Allocated", true],
              ["Check-in", false],
            ].map(([label, completed]) => (
              <div
                key={label}
                className="flex items-center gap-4"
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    completed
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                />

                <span className="text-sm text-slate-700">
                  {label}
                </span>
              </div>
            ))}

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Notifications
          </h2>

          <div className="mt-5 space-y-4">

            <div className="border-b border-slate-100 pb-4">
              <p className="text-sm font-medium">
                Fee payment reminder
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your hostel fee is due soon.
              </p>
            </div>

            <div className="border-b border-slate-100 pb-4">
              <p className="text-sm font-medium">
                Maintenance update
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your complaint has been assigned.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Hostel announcement
              </p>

              <p className="mt-1 text-xs text-slate-500">
                New notice from the warden.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}