import React, { useState, useEffect } from "react";
import { Bell, Search, ChevronDown, Check, X, BellOff, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Store } from "../services/store";

export default function Navbar({ userName = "Falashree", role = "Student", onToggleMobileSidebar = () => {} }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = () => {
    const list = Store.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("hms_store_updated", loadNotifications);
    return () => window.removeEventListener("hms_store_updated", loadNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    Store.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    Store.markAllNotificationsRead();
    loadNotifications();
  };

  return (
    <header className="fixed left-0 md:left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      {/* Left: Mobile Menu Hamburger & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden sm:flex w-48 md:w-80 items-center gap-3 rounded-xl bg-slate-100/80 px-4 py-2.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 border border-transparent focus-within:border-slate-300">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`relative flex items-start gap-3 rounded-xl p-3 text-left transition ${
                        n.read ? "bg-white border border-slate-100 opacity-70" : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold uppercase">
                        {n.type?.charAt(0) || "N"}
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="mt-0.5 text-xs text-slate-600 leading-tight">{n.message}</p>
                        <span className="mt-1 block text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700"
                          title="Mark read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    <BellOff size={28} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium">No notifications yet</p>
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                <Link
                  to={`/${role.toLowerCase()}/notifications`}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-xs shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{userName}</p>
            <p className="text-xs capitalize font-medium text-slate-500">{role}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}