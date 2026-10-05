import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function StaffLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role="staff"
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <Navbar
        userName="Hostel Staff"
        role="Staff"
        onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <main className="ml-0 md:ml-64 pt-20 transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}