import {
  Users,
  Wrench,
  LogIn,
  LogOut,
  MessageSquareWarning,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function StaffDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Staff Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage visitors, maintenance and daily hostel operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Visitors"
          value="31"
          description="19 checked out"
          icon={Users}
        />

        <StatCard
          title="Currently Inside"
          value="12"
          description="Active visitors"
          icon={LogIn}
        />

        <StatCard
          title="Maintenance"
          value="8"
          description="Pending requests"
          icon={Wrench}
        />

        <StatCard
          title="Complaints"
          value="5"
          description="Need attention"
          icon={MessageSquareWarning}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Visitor Activity
              </h2>
              <p className="text-sm text-slate-500">
                Today's visitor entries
              </p>
            </div>

            <Users size={20} className="text-slate-400" />
          </div>

          <div className="mt-5 space-y-4">
            {[
              ["Rajesh Kumar", "Room A-203", "10:32 AM"],
              ["Priya Shah", "Room B-102", "11:14 AM"],
              ["Amit Joshi", "Room A-115", "12:05 PM"],
              ["Neha Patil", "Room C-204", "01:20 PM"],
            ].map(([name, room, time]) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-slate-100 pb-4"
              >
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-slate-500">{room}</p>
                </div>

                <span className="text-xs text-slate-500">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Maintenance Requests
              </h2>

              <p className="text-sm text-slate-500">
                Requests requiring action
              </p>
            </div>

            <Wrench size={20} className="text-slate-400" />
          </div>

          <div className="mt-5 space-y-4">
            {[
              ["Broken fan", "Room A-203", "High"],
              ["Leaking tap", "Room B-102", "Medium"],
              ["Tube light", "Room C-301", "Low"],
              ["Door lock", "Room A-118", "High"],
            ].map(([issue, room, priority]) => (
              <div
                key={issue}
                className="flex items-center justify-between border-b border-slate-100 pb-4"
              >
                <div>
                  <p className="text-sm font-medium">{issue}</p>
                  <p className="text-xs text-slate-500">{room}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatCard
          title="Check-ins Today"
          value="18"
          description="Scheduled arrivals"
          icon={LogIn}
        />

        <StatCard
          title="Check-outs Today"
          value="7"
          description="Scheduled departures"
          icon={LogOut}
        />
      </div>
    </div>
  );
}