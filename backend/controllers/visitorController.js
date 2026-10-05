let visitors = [
  {
    id: "VIS-2026-101",
    studentId: "STU-1042",
    studentName: "Falashree",
    rollNo: "2024CS1042",
    roomNo: "B-203",
    visitorName: "Sunita Sharma",
    contact: "+91 9811223355",
    relation: "Mother",
    idType: "Aadhaar Card",
    idNumber: "XXXX-XXXX-9012",
    visitDate: "2026-10-08",
    expectedTime: "04:00 PM",
    status: "APPROVED",
  },
];

const getVisitors = (req, res) => res.json({ success: true, count: visitors.length, data: visitors });

const addVisitor = (req, res) => {
  const v = req.body;
  visitors.unshift(v);
  res.status(201).json({ success: true, message: "Visitor registered", data: v });
};

const updateVisitor = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = visitors.findIndex((item) => item.id === id);
  if (idx >= 0) {
    visitors[idx] = { ...visitors[idx], ...updates };
    res.json({ success: true, message: "Visitor status updated", data: visitors[idx] });
  } else {
    res.status(404).json({ success: false, message: "Visitor not found" });
  }
};

module.exports = { getVisitors, addVisitor, updateVisitor };
