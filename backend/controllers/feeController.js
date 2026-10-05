let fees = [
  {
    id: "INV-2026-001",
    studentId: "STU-1042",
    title: "Hostel & Mess Fee - Autumn Semester 2026",
    dueDate: "2026-10-15",
    totalAmount: 48500,
    paidAmount: 36500,
    dueAmount: 12000,
    status: "UNPAID",
  },
];

let payments = [
  {
    transactionId: "TXN-99882211",
    invoiceId: "INV-2026-001",
    studentId: "STU-1042",
    paymentDate: "2026-09-05 02:30 PM",
    amount: 36500,
    paymentMethod: "Razorpay (UPI)",
    status: "SUCCESS",
  },
];

const getFees = (req, res) => res.json({ success: true, count: fees.length, data: fees });
const getPayments = (req, res) => res.json({ success: true, count: payments.length, data: payments });
const processPayment = (req, res) => {
  const p = req.body;
  payments.unshift(p);
  const invoice = fees.find((f) => f.id === p.invoiceId);
  if (invoice) {
    invoice.paidAmount += p.amount;
    invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
    invoice.status = invoice.dueAmount === 0 ? "PAID" : "UNPAID";
  }
  res.status(201).json({ success: true, message: "Payment processed", data: p });
};

module.exports = { getFees, getPayments, processPayment };
