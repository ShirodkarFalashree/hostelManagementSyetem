import {
  LayoutDashboard,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  Users,
  ClipboardList,
  Building2,
  Wrench,
  LogOut,
  Bell,
  BarChart3,
  ShieldAlert,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuByRole = {
  student: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { name: "Hostel Application", icon: ClipboardList, path: "/student/application" },
    { name: "My Room", icon: BedDouble, path: "/student/room" },
    { name: "Fees", icon: CreditCard, path: "/student/fees" },
    { name: "Visitors", icon: Users, path: "/student/visitors" },
    { name: "Complaints", icon: MessageSquareWarning, path: "/student/complaints" },
    { name: "Notifications", icon: Bell, path: "/student/notifications" },
  ],

  warden: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/warden/dashboard" },
    { name: "Applications", icon: ClipboardList, path: "/warden/applications" },
    { name: "Rooms & Beds", icon: BedDouble, path: "/warden/rooms" },
    { name: "Occupancy", icon: Building2, path: "/warden/occupancy" },
    { name: "Complaints", icon: MessageSquareWarning, path: "/warden/complaints" },
    { name: "Maintenance", icon: Wrench, path: "/warden/maintenance" },
    { name: "Visitors", icon: Users, path: "/warden/visitors" },
  ],

  staff: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/staff/dashboard" },
    { name: "Visitors", icon: Users, path: "/staff/visitors" },
    { name: "Maintenance", icon: Wrench, path: "/staff/maintenance" },
    { name: "Complaints", icon: MessageSquareWarning, path: "/staff/complaints" },
  ],

  admin: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "Hostel Config", icon: Building2, path: "/admin/hostels" },
    { name: "Rooms & Beds", icon: BedDouble, path: "/admin/rooms" },
    { name: "Fee Config", icon: CreditCard, path: "/admin/fees" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Audit Logs", icon: ShieldAlert, path: "/admin/audit-logs" },
  ],
};

export default function Sidebar({ role = "student", isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const menuItems = menuByRole[role] || [];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Mobile Close */}
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                <Building2 size={21} />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 tracking-tight">HostelHub</h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Management System</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 p-4 max-h-[calc(100vh-140px)] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}