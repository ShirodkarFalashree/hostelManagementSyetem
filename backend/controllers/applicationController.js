// Mock in-memory database store for backend API fallback
let applications = [
  {
    id: "APP-2026-0042",
    studentId: "STU-1042",
    fullName: "Falashree",
    email: "falashree@university.edu",
    phone: "+91 9876543210",
    dob: "2003-05-14",
    gender: "Female",
    bloodGroup: "O+",
    permanentAddress: "42 Park Street, Indiranagar, Bengaluru, Karnataka - 560038",
    rollNo: "2024CS1042",
    course: "B.Tech Computer Science",
    branch: "CSE",
    year: "3rd Year",
    cgpa: "8.85",
    category: "General",
    emergencyContact: { name: "Ramesh Sharma", relation: "Father", phone: "+91 9811223344", address: "42 Park Street, Indiranagar, Bengaluru" },
    hostelPreference: "Hostel B (Girls Hostel)",
    roomTypePreference: "Double Shared - AC",
    documents: { idProof: "Aadhaar_Card_Verified.pdf", admissionLetter: "Admission_Letter_2024.pdf", photo: "Student_Photo.jpg" },
    status: "ALLOCATED",
    allocatedRoom: "B-203",
    allocatedBed: "Bed-1",
    submissionDate: "2026-09-01 10:30 AM",
    remarks: "Room B-203 Bed-1 allocated based on merit preference.",
    timeline: [
      { title: "Draft Saved", date: "2026-08-30 04:15 PM", status: "COMPLETED" },
      { title: "Application Submitted", date: "2026-09-01 10:30 AM", status: "COMPLETED" },
      { title: "Under Review by Warden", date: "2026-09-02 11:00 AM", status: "COMPLETED" },
      { title: "Application Approved", date: "2026-09-03 02:45 PM", status: "COMPLETED" },
      { title: "Room & Bed Allocated", date: "2026-09-04 09:15 AM", status: "COMPLETED" },
    ],
  },
];

const getApplications = (req, res) => {
  res.json({ success: true, count: applications.length, data: applications });
};

const getApplicationById = (req, res) => {
  const app = applications.find((a) => a.id === req.params.id || a.studentId === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: "Application not found" });
  res.json({ success: true, data: app });
};

const createOrUpdateApplication = (req, res) => {
  const appData = req.body;
  const existingIdx = applications.findIndex((a) => a.id === appData.id || a.studentId === appData.studentId);
  if (existingIdx >= 0) {
    applications[existingIdx] = { ...applications[existingIdx], ...appData };
  } else {
    applications.unshift(appData);
  }
  res.status(201).json({ success: true, message: "Application saved", data: appData });
};

const updateStatus = (req, res) => {
  const { status, remarks } = req.body;
  const app = applications.find((a) => a.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: "Application not found" });

  app.status = status;
  if (remarks) app.remarks = remarks;
  app.timeline.push({ title: `Status changed to ${status}`, date: new Date().toLocaleString(), status: "COMPLETED", remarks });

  res.json({ success: true, message: `Status updated to ${status}`, data: app });
};

module.exports = {
  getApplications,
  getApplicationById,
  createOrUpdateApplication,
  updateStatus,
};
