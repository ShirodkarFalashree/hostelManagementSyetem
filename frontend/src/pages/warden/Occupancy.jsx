import React, { useState, useEffect } from "react";
import { Building2, BedDouble, CheckCircle2, Wrench, Ban, Filter, BarChart3 } from "lucide-react";
import StatCard from "../../components/StatCard";
import { Store } from "../../services/store";

export default function WardenOccupancy() {
  const [rooms, setRooms] = useState([]);
  const [hostelFilter, setHostelFilter] = useState("ALL");
  const [blockFilter, setBlockFilter] = useState("ALL");

  useEffect(() => {
    const loadRooms = () => setRooms(Store.getRooms());
    loadRooms();
    window.addEventListener("hms_store_updated", loadRooms);
    return () => window.removeEventListener("hms_store_updated", loadRooms);
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (hostelFilter !== "ALL" && !r.hostel.includes(hostelFilter)) return false;
    if (blockFilter !== "ALL" && r.block !== blockFilter) return false;
    return true;
  });

  const totalBeds = filteredRooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = filteredRooms.reduce((sum, r) => sum + r.occupancy, 0);
  const availableBeds = filteredRooms.reduce((sum, r) => sum + (r.capacity - r.occupancy), 0);
  const maintenanceRooms = filteredRooms.filter((r) => r.status === "MAINTENANCE").length;
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Occupancy Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time breakdown of capacity, bed utilization rates, maintenance blocks, and availability.
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Hostel Beds" value={totalBeds.toString()} description="Configured bed capacity" icon={BedDouble} />
        <StatCard title="Occupied Beds" value={occupiedBeds.toString()} description={`${occupancyPercentage}% current occupancy`} icon={CheckCircle2} />
        <StatCard title="Available Beds" value={availableBeds.toString()} description="Ready for immediate allocation" icon={Building2} />
        <StatCard title="Rooms in Maintenance" value={maintenanceRooms.toString()} description="Temporarily blocked rooms" icon={Wrench} />
      </div>

      {/* Progress Bar & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Overall Capacity Utilization</h2>
            <p className="text-xs text-slate-500">Live bed allocation occupancy metric</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
            >
              <option value="ALL">All Hostels</option>
              <option value="Hostel A">Hostel A (Boys)</option>
              <option value="Hostel B">Hostel B (Girls)</option>
            </select>

            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
            >
              <option value="ALL">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
            </select>
          </div>
        </div>

        {/* Big Occupancy Gauge Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-slate-700">Occupancy Rate</span>
            <span className="text-slate-900 text-sm font-extrabold">{occupancyPercentage}%</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-slate-900 h-full transition-all duration-500" style={{ width: `${occupancyPercentage}%` }} />
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${100 - occupancyPercentage}%` }} />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 font-medium"><span className="h-2 w-2 rounded-full bg-slate-900"></span> Occupied ({occupiedBeds})</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Vacant ({availableBeds})</span>
          </div>
        </div>
      </div>

      {/* Room Details Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Hostel Block Occupancy Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRooms.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-slate-900">Room {r.roomNumber}</span>
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">{r.occupancy}/{r.capacity} Occupied</span>
              </div>
              <p className="text-xs text-slate-500">{r.hostel} · {r.block}</p>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full" style={{ width: `${(r.occupancy / r.capacity) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
