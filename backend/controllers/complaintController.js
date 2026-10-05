let complaints = [
  {
    id: "CMP-2026-014",
    studentId: "STU-1042",
    studentName: "Falashree",
    rollNo: "2024CS1042",
    roomNo: "B-203",
    category: "Plumbing",
    title: "Bathroom tap leaking continuously",
    description: "The washroom sink tap in B-203 is leaking water continuously since yesterday evening.",
    priority: "High",
    status: "IN_PROGRESS",
    assignedStaff: "Rajesh Kumar (Plumber)",
    createdAt: "2026-10-04 09:30 AM",
    timeline: [
      { title: "Complaint Registered", date: "2026-10-04 09:30 AM", status: "COMPLETED" },
      { title: "Assigned to Staff", date: "2026-10-04 02:00 PM", status: "COMPLETED" },
    ],
  },
];

let workOrders = [
  {
    id: "WO-2026-089",
    complaintId: "CMP-2026-014",
    title: "Fix Washroom Tap Leakage in B-203",
    category: "Plumbing",
    roomNo: "B-203",
    priority: "High",
    assignedStaff: "Rajesh Kumar",
    status: "IN_PROGRESS",
  },
];

const getComplaints = (req, res) => res.json({ success: true, count: complaints.length, data: complaints });

const addComplaint = (req, res) => {
  const c = req.body;
  complaints.unshift(c);
  res.status(201).json({ success: true, message: "Complaint logged", data: c });
};

const updateComplaint = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = complaints.findIndex((item) => item.id === id);
  if (idx >= 0) {
    complaints[idx] = { ...complaints[idx], ...updates };
    res.json({ success: true, message: "Complaint updated", data: complaints[idx] });
  } else {
    res.status(404).json({ success: false, message: "Complaint not found" });
  }
};

const getWorkOrders = (req, res) => res.json({ success: true, count: workOrders.length, data: workOrders });

const updateWorkOrder = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = workOrders.findIndex((item) => item.id === id);
  if (idx >= 0) {
    workOrders[idx] = { ...workOrders[idx], ...updates };
  } else {
    workOrders.unshift(updates);
  }
  res.json({ success: true, message: "Work order updated" });
};

module.exports = {
  getComplaints,
  addComplaint,
  updateComplaint,
  getWorkOrders,
  updateWorkOrder,
};
