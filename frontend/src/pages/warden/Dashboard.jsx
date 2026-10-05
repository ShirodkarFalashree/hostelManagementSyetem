import {
  Users,
  BedDouble,
  ClipboardList,
  MessageSquareWarning,
  UserCheck,
  Wrench,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function WardenDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Warden Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of hostel operations and student activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value="428"
          description="Currently allocated"
          icon={Users}
        />

        <StatCard
          title="Occupancy"
          value="86%"
          description="428 of 500 beds"
          icon={BedDouble}
        />

        <StatCard
          title="Applications"
          value="24"
          description="Awaiting review"
          icon={ClipboardList}
        />

        <StatCard
          title="Complaints"
          value="17"
          description="5 unresolved"
          icon={MessageSquareWarning}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Pending Applications
          </h2>

          <div className="mt-5 space-y-4">
            {[
              ["Rahul Sharma", "First Year", "2 hours ago"],
              ["Aarav Patil", "Second Year", "4 hours ago"],
              ["Sneha Kulkarni", "First Year", "Yesterday"],
              ["Isha Mehta", "Third Year", "Yesterday"],
            ].map(([name, year, time]) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {year}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">{time}</p>
                  <button className="mt-1 text-xs font-semibold text-slate-900">
                    Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Hostel Overview
          </h2>

          <div className="mt-6 space-y-6">
            {[
              ["Block A", 94],
              ["Block B", 82],
              ["Block C", 76],
            ].map(([block, percentage]) => (
              <div key={block}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{block}</span>
                  <span className="text-slate-500">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          title="Today's Visitors"
          value="31"
          description="12 currently inside"
          icon={UserCheck}
        />

        <StatCard
          title="Maintenance"
          value="8"
          description="3 high priority"
          icon={Wrench}
        />

        <StatCard
          title="Room Requests"
          value="6"
          description="Awaiting approval"
          icon={BedDouble}
        />
      </div>
    </div>
  );
}