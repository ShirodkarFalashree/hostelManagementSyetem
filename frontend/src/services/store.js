// Central state storage for Hostel Management System (Persisted in LocalStorage)

const STORAGE_KEYS = {
  APPLICATIONS: "hms_applications",
  ROOMS: "hms_rooms",
  ROOM_CHANGES: "hms_room_changes",
  FEES: "hms_fees",
  VISITORS: "hms_visitors",
  COMPLAINTS: "hms_complaints",
  WORK_ORDERS: "hms_work_orders",
  NOTIFICATIONS: "hms_notifications",
  USERS: "hms_users",
  AUDIT_LOGS: "hms_audit_logs",
  FEE_STRUCTURES: "hms_fee_structures",
};

// Initial Seed Data
const initialApplications = [
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
    emergencyContact: {
      name: "Ramesh Sharma",
      relation: "Father",
      phone: "+91 9811223344",
      address: "42 Park Street, Indiranagar, Bengaluru",
    },
    hostelPreference: "Hostel B (Girls Hostel)",
    roomTypePreference: "Double Shared - AC",
    documents: {
      idProof: "Aadhaar_Card_Verified.pdf",
      admissionLetter: "Admission_Letter_2024.pdf",
      photo: "Student_Photo.jpg",
    },
    status: "ALLOCATED",
    allocatedRoom: "B-203",
    allocatedBed: "Bed-1",
    submissionDate: "2026-09-01 10:30 AM",
    remarks: "Room B-203 Bed-1 allocated based on merit preference.",
    timeline: [
      { title: "Draft Saved", date: "2026-08-30 04:15 PM", status: "COMPLETED", remarks: "Draft initialized" },
      { title: "Application Submitted", date: "2026-09-01 10:30 AM", status: "COMPLETED", remarks: "Documents uploaded" },
      { title: "Under Review by Warden", date: "2026-09-02 11:00 AM", status: "COMPLETED", remarks: "Eligibility verified" },
      { title: "Application Approved", date: "2026-09-03 02:45 PM", status: "COMPLETED", remarks: "Approved by Chief Warden" },
      { title: "Room & Bed Allocated", date: "2026-09-04 09:15 AM", status: "COMPLETED", remarks: "Allocated to Block B, Room 203" },
    ],
  },
  {
    id: "APP-2026-0043",
    studentId: "STU-1043",
    fullName: "Aarav Sharma",
    email: "aarav.s@university.edu",
    phone: "+91 9823456789",
    dob: "2002-11-20",
    gender: "Male",
    bloodGroup: "B+",
    permanentAddress: "15 Civil Lines, Jaipur, Rajasthan",
    rollNo: "2024EC1012",
    course: "B.Tech Electronics",
    branch: "ECE",
    year: "2nd Year",
    cgpa: "7.90",
    category: "OBC",
    emergencyContact: {
      name: "Suresh Sharma",
      relation: "Father",
      phone: "+91 9877112233",
      address: "15 Civil Lines, Jaipur",
    },
    hostelPreference: "Hostel A (Boys Hostel)",
    roomTypePreference: "Single Room - Non AC",
    documents: {
      idProof: "Aadhaar_Aarav.pdf",
      admissionLetter: "Admission_ECE.pdf",
      photo: "Photo_Aarav.jpg",
    },
    status: "SUBMITTED",
    allocatedRoom: "",
    allocatedBed: "",
    submissionDate: "2026-09-10 02:15 PM",
    remarks: "Pending document verification.",
    timeline: [
      { title: "Application Submitted", date: "2026-09-10 02:15 PM", status: "COMPLETED", remarks: "Awaiting review" },
      { title: "Under Review", date: "2026-09-11 09:00 AM", status: "IN_PROGRESS", remarks: "Warden reviewing documents" },
    ],
  },
  {
    id: "APP-2026-0044",
    studentId: "STU-1044",
    fullName: "Priya Nair",
    email: "priya.nair@university.edu",
    phone: "+91 9711223344",
    dob: "2003-01-08",
    gender: "Female",
    bloodGroup: "A+",
    permanentAddress: "88 MG Road, Kochi, Kerala",
    rollNo: "2024ME1055",
    course: "B.Tech Mechanical",
    branch: "ME",
    year: "1st Year",
    cgpa: "9.10",
    category: "SC",
    emergencyContact: {
      name: "Lakshmi Nair",
      relation: "Mother",
      phone: "+91 9445566778",
      address: "88 MG Road, Kochi",
    },
    hostelPreference: "Hostel B (Girls Hostel)",
    roomTypePreference: "Triple Shared - Non AC",
    documents: {
      idProof: "Priya_Govt_ID.pdf",
      admissionLetter: "Admission_Priya.pdf",
      photo: "Priya.jpg",
    },
    status: "WAITLISTED",
    allocatedRoom: "",
    allocatedBed: "",
    submissionDate: "2026-09-12 11:45 AM",
    remarks: "Waitlisted position #4 due to high capacity in Hostel B.",
    timeline: [
      { title: "Application Submitted", date: "2026-09-12 11:45 AM", status: "COMPLETED", remarks: "Submitted" },
      { title: "Under Review", date: "2026-09-13 10:00 AM", status: "COMPLETED", remarks: "Reviewed" },
      { title: "Waitlisted", date: "2026-09-14 04:00 PM", status: "COMPLETED", remarks: "Position #4" },
    ],
  },
];

const initialRooms = [
  {
    id: "ROOM-B203",
    hostel: "Hostel B (Girls Hostel)",
    block: "Block B",
    floor: "2nd Floor",
    roomNumber: "B-203",
    roomType: "Double Shared - AC",
    capacity: 2,
    occupancy: 2,
    status: "OCCUPIED",
    amenities: ["AC", "Attached Washroom", "Wi-Fi Router", "Balcony", "2 Study Desks", "2 Wardrobes"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Falashree (2024CS1042)" },
      { bedNo: "Bed-2", status: "OCCUPIED", student: "Ananya Deshmukh (2024CS1088)" },
    ],
  },
  {
    id: "ROOM-B204",
    hostel: "Hostel B (Girls Hostel)",
    block: "Block B",
    floor: "2nd Floor",
    roomNumber: "B-204",
    roomType: "Double Shared - Non AC",
    capacity: 2,
    occupancy: 1,
    status: "AVAILABLE",
    amenities: ["Fan", "Wi-Fi", "Balcony", "Study Desks"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Sneha Patel (2024EC1090)" },
      { bedNo: "Bed-2", status: "AVAILABLE", student: null },
    ],
  },
  {
    id: "ROOM-A101",
    hostel: "Hostel A (Boys Hostel)",
    block: "Block A",
    floor: "1st Floor",
    roomNumber: "A-101",
    roomType: "Single Room - Non AC",
    capacity: 1,
    occupancy: 0,
    status: "AVAILABLE",
    amenities: ["Single Bed", "Study Table", "Wardrobe", "Wi-Fi"],
    beds: [{ bedNo: "Bed-1", status: "AVAILABLE", student: null }],
  },
  {
    id: "ROOM-A102",
    hostel: "Hostel A (Boys Hostel)",
    block: "Block A",
    floor: "1st Floor",
    roomNumber: "A-102",
    roomType: "Double Shared - AC",
    capacity: 2,
    occupancy: 2,
    status: "OCCUPIED",
    amenities: ["AC", "Attached Washroom", "Wi-Fi"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Rohan Verma (2024CS1001)" },
      { bedNo: "Bed-2", status: "OCCUPIED", student: "Karan Mehta (2024CS1002)" },
    ],
  },
  {
    id: "ROOM-A103",
    hostel: "Hostel A (Boys Hostel)",
    block: "Block A",
    floor: "1st Floor",
    roomNumber: "A-103",
    roomType: "Triple Shared - Non AC",
    capacity: 3,
    occupancy: 1,
    status: "MAINTENANCE",
    amenities: ["Fan", "Shared Bathroom", "Study Desks"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Vikram Singh (2024ME1005)" },
      { bedNo: "Bed-2", status: "MAINTENANCE", student: null },
      { bedNo: "Bed-3", status: "MAINTENANCE", student: null },
    ],
  },
];

const initialRoomChanges = [
  {
    id: "RC-2026-001",
    studentId: "STU-1042",
    studentName: "Falashree",
    rollNo: "2024CS1042",
    currentRoom: "B-203",
    preferredBlock: "Block B",
    preferredRoomType: "Single Room - AC",
    reason: "Require quiet environment for final year research project preparation.",
    status: "UNDER REVIEW",
    requestDate: "2026-09-20 03:30 PM",
    remarks: "Pending availability check in Block B Single AC wing.",
  },
];

const initialFees = [
  {
    id: "INV-2026-001",
    studentId: "STU-1042",
    title: "Hostel & Mess Fee - Autumn Semester 2026",
    academicYear: "2026-2027",
    dueDate: "2026-10-15",
    totalAmount: 48500,
    breakdown: {
      hostelFee: 28000,
      messFee: 15000,
      electricityWater: 3500,
      amenitiesFee: 2000,
    },
    paidAmount: 36500,
    dueAmount: 12000,
    status: "UNPAID", // Partial
  },
];

const initialFeeHistory = [
  {
    transactionId: "TXN-99882211",
    invoiceId: "INV-2026-001",
    studentId: "STU-1042",
    paymentDate: "2026-09-05 02:30 PM",
    amount: 36500,
    paymentMethod: "Razorpay (UPI)",
    status: "SUCCESS",
    receiptUrl: "#",
    description: "Partial Payment - Autumn Semester 2026",
  },
  {
    transactionId: "TXN-88771100",
    invoiceId: "INV-2025-002",
    studentId: "STU-1042",
    paymentDate: "2026-01-10 11:15 AM",
    amount: 45000,
    paymentMethod: "Net Banking (HDFC)",
    status: "SUCCESS",
    receiptUrl: "#",
    description: "Spring Semester 2026 Fee",
  },
];

const initialVisitors = [
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
    actualCheckIn: "-",
    actualCheckOut: "-",
    purpose: "Family visit and bringing academic materials.",
    status: "APPROVED",
  },
  {
    id: "VIS-2026-099",
    studentId: "STU-1042",
    studentName: "Falashree",
    rollNo: "2024CS1042",
    roomNo: "B-203",
    visitorName: "Ramesh Sharma",
    contact: "+91 9811223344",
    relation: "Father",
    idType: "Driving License",
    idNumber: "KA-04-2019-00123",
    visitDate: "2026-09-15",
    expectedTime: "11:00 AM",
    actualCheckIn: "2026-09-15 11:05 AM",
    actualCheckOut: "2026-09-15 03:30 PM",
    purpose: "Semester admission setup.",
    status: "CHECKED_OUT",
  },
];

const initialComplaints = [
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
    attachment: "bathroom_tap_leak.jpg",
    status: "IN_PROGRESS",
    assignedStaff: "Rajesh Kumar (Plumber)",
    assignedStaffId: "STAFF-02",
    createdAt: "2026-10-04 09:30 AM",
    updatedAt: "2026-10-05 10:15 AM",
    timeline: [
      { title: "Complaint Registered", date: "2026-10-04 09:30 AM", status: "COMPLETED", remarks: "Filed by student" },
      { title: "Assigned to Staff", date: "2026-10-04 02:00 PM", status: "COMPLETED", remarks: "Assigned to Rajesh Kumar" },
      { title: "In Progress", date: "2026-10-05 10:15 AM", status: "COMPLETED", remarks: "Replacement parts requested" },
    ],
  },
  {
    id: "CMP-2026-009",
    studentId: "STU-1042",
    studentName: "Falashree",
    rollNo: "2024CS1042",
    roomNo: "B-203",
    category: "Wi-Fi",
    title: "Slow internet speed in 2nd Floor B Block",
    description: "Wi-Fi disconnects frequently during online lectures.",
    priority: "Medium",
    attachment: null,
    status: "RESOLVED",
    assignedStaff: "Amit Verma (IT Tech)",
    assignedStaffId: "STAFF-05",
    createdAt: "2026-09-25 11:00 AM",
    updatedAt: "2026-09-26 04:00 PM",
    rating: 5,
    resolutionNotes: "Router rebooted and firmware updated. Signal boosted.",
    timeline: [
      { title: "Complaint Registered", date: "2026-09-25 11:00 AM", status: "COMPLETED" },
      { title: "Assigned to IT Staff", date: "2026-09-25 01:00 PM", status: "COMPLETED" },
      { title: "Resolved", date: "2026-09-26 04:00 PM", status: "COMPLETED", remarks: "Router upgraded" },
      { title: "Resolution Confirmed", date: "2026-09-27 10:00 AM", status: "COMPLETED", remarks: "Rated 5/5 stars" },
    ],
  },
];

const initialWorkOrders = [
  {
    id: "WO-2026-089",
    complaintId: "CMP-2026-014",
    title: "Fix Washroom Tap Leakage in B-203",
    category: "Plumbing",
    roomNo: "B-203",
    priority: "High",
    assignedStaff: "Rajesh Kumar",
    assignedStaffId: "STAFF-02",
    status: "IN_PROGRESS",
    targetDate: "2026-10-06",
    notes: "Ordered replacement brass valve seal from store.",
    proofImage: null,
  },
];

const initialNotifications = [
  {
    id: "NOTIF-101",
    userRole: "student",
    userId: "STU-1042",
    title: "Hostel Fee Outstanding",
    message: "Your pending hostel fee balance is ₹12,000. Due date is Oct 15, 2026.",
    type: "fee",
    timestamp: "2026-10-05 08:00 AM",
    read: false,
  },
  {
    id: "NOTIF-102",
    userRole: "student",
    userId: "STU-1042",
    title: "Complaint Status Update",
    message: "Plumbing complaint CMP-2026-014 has been updated to IN_PROGRESS.",
    type: "complaint",
    timestamp: "2026-10-05 10:15 AM",
    read: false,
  },
  {
    id: "NOTIF-103",
    userRole: "student",
    userId: "STU-1042",
    title: "Visitor Registration Approved",
    message: "Visitor request for Sunita Sharma on 2026-10-08 is APPROVED by Warden.",
    type: "visitor",
    timestamp: "2026-10-04 05:30 PM",
    read: true,
  },
];

const initialUsers = [
  { id: "USR-001", name: "Falashree", email: "falashree@university.edu", role: "Student", department: "Computer Science", status: "Active", phone: "+91 9876543210" },
  { id: "USR-002", name: "Dr. K. S. Sharma", email: "warden.b@university.edu", role: "Warden", department: "Girls Hostel B", status: "Active", phone: "+91 9811002233" },
  { id: "USR-003", name: "Rajesh Kumar", email: "rajesh.staff@university.edu", role: "Staff", department: "Maintenance (Plumbing)", status: "Active", phone: "+91 9877001122" },
  { id: "USR-004", name: "System Admin", email: "admin@university.edu", role: "Admin", department: "Central Administration", status: "Active", phone: "+91 9800112233" },
];

const initialAuditLogs = [
  { id: "LOG-501", user: "Falashree", role: "Student", action: "Submitted Visitor Request", category: "VISITOR", timestamp: "2026-10-04 04:30 PM", ip: "192.168.1.45" },
  { id: "LOG-502", user: "Dr. K. S. Sharma", role: "Warden", action: "Approved Room Allocation APP-2026-0042", category: "APPLICATION", timestamp: "2026-09-04 09:15 AM", ip: "192.168.1.12" },
  { id: "LOG-503", user: "Falashree", role: "Student", action: "Fee Payment ₹36,500 via Razorpay", category: "PAYMENT", timestamp: "2026-09-05 02:30 PM", ip: "192.168.1.45" },
];

// LocalStorage Helper functions
function getStorage(key, initialData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error("Storage error:", e);
    return initialData;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger custom event so reactive components re-render across tabs/views
    window.dispatchEvent(new Event("hms_store_updated"));
  } catch (e) {
    console.error("Storage write error:", e);
  }
}

export const Store = {
  // Applications
  getApplications: () => getStorage(STORAGE_KEYS.APPLICATIONS, initialApplications),
  saveApplication: (appData) => {
    const apps = getStorage(STORAGE_KEYS.APPLICATIONS, initialApplications);
    const existingIdx = apps.findIndex((a) => a.id === appData.id || a.studentId === appData.studentId);
    let updated;
    if (existingIdx >= 0) {
      updated = [...apps];
      updated[existingIdx] = { ...updated[existingIdx], ...appData };
    } else {
      updated = [appData, ...apps];
    }
    setStorage(STORAGE_KEYS.APPLICATIONS, updated);
    Store.addAuditLog("Student / User", "Updated Application " + appData.id, "APPLICATION");
    return appData;
  },

  // Rooms
  getRooms: () => getStorage(STORAGE_KEYS.ROOMS, initialRooms),
  updateRoom: (roomData) => {
    const rooms = getStorage(STORAGE_KEYS.ROOMS, initialRooms);
    const updated = rooms.map((r) => (r.id === roomData.id ? roomData : r));
    setStorage(STORAGE_KEYS.ROOMS, updated);
  },

  // Room Changes
  getRoomChanges: () => getStorage(STORAGE_KEYS.ROOM_CHANGES, initialRoomChanges),
  addRoomChangeRequest: (req) => {
    const list = getStorage(STORAGE_KEYS.ROOM_CHANGES, initialRoomChanges);
    const updated = [req, ...list];
    setStorage(STORAGE_KEYS.ROOM_CHANGES, updated);
    Store.addAuditLog(req.studentName, "Submitted Room Change Request for " + req.currentRoom, "ROOM");
  },
  updateRoomChangeRequest: (id, updates) => {
    const list = getStorage(STORAGE_KEYS.ROOM_CHANGES, initialRoomChanges);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setStorage(STORAGE_KEYS.ROOM_CHANGES, updated);
  },

  // Fees
  getFees: () => getStorage(STORAGE_KEYS.FEES, initialFees),
  getFeeHistory: () => getStorage(STORAGE_KEYS.FEES + "_history", initialFeeHistory),
  recordPayment: (paymentObj) => {
    const fees = getStorage(STORAGE_KEYS.FEES, initialFees);
    const history = getStorage(STORAGE_KEYS.FEES + "_history", initialFeeHistory);
    
    // Update invoice balance
    const updatedFees = fees.map((f) => {
      if (f.id === paymentObj.invoiceId) {
        const newPaid = f.paidAmount + paymentObj.amount;
        const newDue = Math.max(0, f.totalAmount - newPaid);
        return {
          ...f,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newDue === 0 ? "PAID" : "UNPAID",
        };
      }
      return f;
    });

    const updatedHistory = [paymentObj, ...history];
    setStorage(STORAGE_KEYS.FEES, updatedFees);
    setStorage(STORAGE_KEYS.FEES + "_history", updatedHistory);
    Store.addAuditLog("Student", `Payment ₹${paymentObj.amount} recorded via ${paymentObj.paymentMethod}`, "PAYMENT");
  },

  // Visitors
  getVisitors: () => getStorage(STORAGE_KEYS.VISITORS, initialVisitors),
  addVisitor: (v) => {
    const list = getStorage(STORAGE_KEYS.VISITORS, initialVisitors);
    const updated = [v, ...list];
    setStorage(STORAGE_KEYS.VISITORS, updated);
    Store.addAuditLog(v.studentName, `Registered Visitor: ${v.visitorName}`, "VISITOR");
  },
  updateVisitor: (id, updates) => {
    const list = getStorage(STORAGE_KEYS.VISITORS, initialVisitors);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setStorage(STORAGE_KEYS.VISITORS, updated);
  },

  // Complaints
  getComplaints: () => getStorage(STORAGE_KEYS.COMPLAINTS, initialComplaints),
  addComplaint: (c) => {
    const list = getStorage(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    const updated = [c, ...list];
    setStorage(STORAGE_KEYS.COMPLAINTS, updated);
    Store.addAuditLog(c.studentName, `Created Complaint #${c.id} (${c.category})`, "COMPLAINT");
  },
  updateComplaint: (id, updates) => {
    const list = getStorage(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setStorage(STORAGE_KEYS.COMPLAINTS, updated);
  },

  // Work Orders
  getWorkOrders: () => getStorage(STORAGE_KEYS.WORK_ORDERS, initialWorkOrders),
  updateWorkOrder: (id, updates) => {
    const list = getStorage(STORAGE_KEYS.WORK_ORDERS, initialWorkOrders);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setStorage(STORAGE_KEYS.WORK_ORDERS, updated);
  },

  // Notifications
  getNotifications: () => getStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
  markNotificationRead: (id) => {
    const list = getStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.map((item) => (item.id === id ? { ...item, read: true } : item));
    setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },
  markAllNotificationsRead: () => {
    const list = getStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.map((item) => ({ ...item, read: true }));
    setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Users
  getUsers: () => getStorage(STORAGE_KEYS.USERS, initialUsers),
  addUser: (u) => {
    const list = getStorage(STORAGE_KEYS.USERS, initialUsers);
    const updated = [u, ...list];
    setStorage(STORAGE_KEYS.USERS, updated);
    Store.addAuditLog("Admin", `Created User ${u.name} (${u.role})`, "USER");
  },
  updateUser: (id, updates) => {
    const list = getStorage(STORAGE_KEYS.USERS, initialUsers);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setStorage(STORAGE_KEYS.USERS, updated);
  },

  // Audit Logs
  getAuditLogs: () => getStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs),
  addAuditLog: (user, action, category) => {
    const logs = getStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    const newLog = {
      id: "LOG-" + Math.floor(100 + Math.random() * 900),
      user,
      role: "System",
      action,
      category,
      timestamp: new Date().toLocaleString(),
      ip: "127.0.0.1",
    };
    setStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  },
};
