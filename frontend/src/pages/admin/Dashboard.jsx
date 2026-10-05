import {
  Users,
  Building2,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  UserCheck,
  ClipboardList,
  Wrench,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Complete overview of the hostel management system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,248"
          description="+42 this semester"
          icon={Users}
        />

        <StatCard
          title="Hostels"
          value="6"
          description="All operational"
          icon={Building2}
        />

        <StatCard
          title="Total Beds"
          value="1,500"
          description="1,248 occupied"
          icon={BedDouble}
        />

        <StatCard
          title="Occupancy"
          value="83.2%"
          description="252 beds available"
          icon={Building2}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Fee Collection"
          value="₹48.2L"
          description="This semester"
          icon={CreditCard}
        />

        <StatCard
          title="Applications"
          value="86"
          description="Pending approval"
          icon={ClipboardList}
        />

        <StatCard
          title="Complaints"
          value="42"
          description="12 unresolved"
          icon={MessageSquareWarning}
        />

        <StatCard
          title="Visitors"
          value="164"
          description="This month"
          icon={UserCheck}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Hostel Occupancy
              </h2>

              <p className="text-sm text-slate-500">
                Current occupancy by hostel
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {[
              ["Boys Hostel A", 91],
              ["Boys Hostel B", 84],
              ["Girls Hostel A", 88],
              ["Girls Hostel B", 79],
              ["Girls Hostel C", 73],
            ].map(([name, percentage]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {name}
                  </span>

                  <span className="text-slate-500">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-2.5 rounded-full bg-slate-900"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            System Activity
          </h2>

          <div className="mt-5 space-y-5">
            {[
              ["New student registered", "5 min ago"],
              ["Fee payment received", "18 min ago"],
              ["Room allocated", "32 min ago"],
              ["Complaint resolved", "1 hr ago"],
              ["New application", "2 hrs ago"],
            ].map(([activity, time]) => (
              <div
                key={activity}
                className="flex gap-3"
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-slate-900" />

                <div>
                  <p className="text-sm font-medium">
                    {activity}
                  </p>

                  <p className="text-xs text-slate-500">
                    {time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Maintenance Overview
            </h2>

            <p className="text-sm text-slate-500">
              Current maintenance workload
            </p>
          </div>

          <Wrench size={20} className="text-slate-400" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold">
              18
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-1 text-2xl font-bold">
              11
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <p className="mt-1 text-2xl font-bold">
              46
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}