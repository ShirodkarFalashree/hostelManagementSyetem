import React, { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Filter, Sparkles, BellOff } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Store } from "../../services/store";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState(null);

  const loadNotifications = () => {
    const list = Store.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("hms_store_updated", loadNotifications);
    return () => window.removeEventListener("hms_store_updated", loadNotifications);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleMarkAsRead = (id) => {
    Store.markNotificationRead(id);
    loadNotifications();
    showToast("Notification marked as read");
  };

  const handleMarkAllRead = () => {
    Store.markAllNotificationsRead();
    loadNotifications();
    showToast("All notifications marked as read");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    return n.type?.toUpperCase() === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            System announcements, fee due reminders, application updates, and room alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "ALL", label: "All Updates" },
          { key: "UNREAD", label: `Unread (${unreadCount})` },
          { key: "FEE", label: "Fee Alerts" },
          { key: "COMPLAINT", label: "Complaints" },
          { key: "VISITOR", label: "Visitors" },
          { key: "APPLICATION", label: "Applications" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              filter === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between rounded-2xl p-5 border transition ${
                n.read ? "bg-white border-slate-200 opacity-80" : "bg-slate-50 border-slate-300 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold uppercase text-xs shadow-xs ${
                    n.read ? "bg-slate-200 text-slate-700" : "bg-slate-900 text-white"
                  }`}
                >
                  {n.type?.charAt(0) || "N"}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-extrabold text-slate-900">{n.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {n.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="mt-2 block text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <Check size={14} /> Mark Read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
            <BellOff size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-bold text-slate-700">No notifications found.</p>
            <p className="text-xs text-slate-400 mt-1">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
