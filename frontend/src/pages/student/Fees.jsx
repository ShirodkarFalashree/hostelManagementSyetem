import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowUpRight,
  Clock,
  Printer,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import { Store } from "../../services/store";

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(12000);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay (UPI)");
  const [paymentState, setPaymentState] = useState("IDLE"); // IDLE, PROCESSING, SUCCESS, FAILED
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    const feeList = Store.getFees();
    const feeHist = Store.getFeeHistory();
    setFees(feeList);
    setHistory(feeHist);
    if (feeList.length > 0) {
      setSelectedInvoice(feeList[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("hms_store_updated", loadData);
    return () => window.removeEventListener("hms_store_updated", loadData);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setPaymentState("PROCESSING");

    setTimeout(() => {
      // Simulate random success (90% success)
      const isSuccess = true;
      if (isSuccess) {
        const newPayment = {
          transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          invoiceId: selectedInvoice ? selectedInvoice.id : "INV-2026-001",
          studentId: "STU-1042",
          paymentDate: new Date().toLocaleString(),
          amount: Number(paymentAmount),
          paymentMethod: paymentMethod,
          status: "SUCCESS",
          receiptUrl: "#",
          description: `Fee Payment for ${selectedInvoice?.title || "Autumn Semester"}`,
        };

        Store.recordPayment(newPayment);
        setPaymentState("SUCCESS");
        loadData();
        showToast("Payment completed successfully!");
      } else {
        setPaymentState("FAILED");
      }
    }, 1500);
  };

  const columns = [
    { header: "Txn ID", accessor: "transactionId", render: (r) => <span className="font-extrabold text-xs text-slate-900">{r.transactionId}</span> },
    { header: "Date & Time", accessor: "paymentDate" },
    { header: "Amount Paid", accessor: "amount", render: (r) => <span className="font-bold text-slate-900">₹{r.amount.toLocaleString()}</span> },
    { header: "Method", accessor: "paymentMethod" },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Receipt",
      render: (r) => (
        <button
          onClick={() => {
            setSelectedReceipt(r);
            setShowReceiptModal(true);
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
        >
          <FileText size={14} /> Receipt
        </button>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-slate-900">Fee Structure & Dues</h1>
          <p className="mt-1 text-sm text-slate-500">
            View breakdown, manage outstanding balances, and complete online payments securely.
          </p>
        </div>

        {selectedInvoice && selectedInvoice.dueAmount > 0 && (
          <button
            onClick={() => {
              setPaymentAmount(selectedInvoice.dueAmount);
              setPaymentState("IDLE");
              setShowPaymentModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md transition"
          >
            <CreditCard size={18} /> Pay Dues Now (₹{selectedInvoice.dueAmount.toLocaleString()})
          </button>
        )}
      </div>

      {/* Invoice Dues Summary Banner */}
      {selectedInvoice && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Fee</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{selectedInvoice.totalAmount.toLocaleString()}</p>
            <span className="text-xs text-slate-500 mt-1 block">{selectedInvoice.title}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Amount Paid</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">₹{selectedInvoice.paidAmount.toLocaleString()}</p>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">Verified Receipts</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Outstanding Dues</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">₹{selectedInvoice.dueAmount.toLocaleString()}</p>
            <span className="text-xs text-rose-600 font-semibold mt-1 block">Due by: {selectedInvoice.dueDate}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Status</span>
              <StatusBadge status={selectedInvoice.status} />
            </div>
            <p className="text-xs text-slate-300">
              {selectedInvoice.dueAmount > 0 ? "Outstanding balance pending payment." : "All fees clear!"}
            </p>
          </div>
        </div>
      )}

      {/* Fee Structure Breakdown & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Card */}
        {selectedInvoice && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Fee Breakdown</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Hostel Rent Fee</span>
                <span className="font-bold text-slate-900">₹{selectedInvoice.breakdown.hostelFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Mess & Food Charges</span>
                <span className="font-bold text-slate-900">₹{selectedInvoice.breakdown.messFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Electricity & Water Utility</span>
                <span className="font-bold text-slate-900">₹{selectedInvoice.breakdown.electricityWater.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Amenities & Maintenance</span>
                <span className="font-bold text-slate-900">₹{selectedInvoice.breakdown.amenitiesFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-slate-900">
                <span>Total Payable</span>
                <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Payment History & Transactions</h2>
          <DataTable
            columns={columns}
            data={history}
            searchPlaceholder="Search transactions..."
            searchKey="transactionId"
            emptyMessage="No payment transactions recorded yet."
          />
        </div>
      </div>

      {/* Payment Processing Modal (Razorpay Simulation) */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Razorpay Secure Fee Gateway" maxWidth="max-w-md">
        {paymentState === "PROCESSING" && <Loader text="Encrypting transaction & contacting bank..." />}

        {paymentState === "SUCCESS" && (
          <div className="py-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-600">Transaction ID: TXN-{Math.floor(10000000 + Math.random() * 90000000)}</p>
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentState("IDLE");
              }}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        )}

        {paymentState === "IDLE" && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Invoice</span>
                <span className="font-bold text-slate-800">{selectedInvoice?.id}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900">
                <span>Amount to Pay</span>
                <span>₹{Number(paymentAmount).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
              >
                <option value="Razorpay (UPI - GPay/PhonePe)">Razorpay (UPI - GPay / PhonePe / Paytm)</option>
                <option value="Net Banking (HDFC/ICICI/SBI)">Net Banking (HDFC / ICICI / SBI)</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="PayU Gateway">PayU Secure Gateway</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              256-bit SSL Encrypted Payment Simulation
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md"
              >
                Pay ₹{Number(paymentAmount).toLocaleString()}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Receipt View Modal */}
      <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} title="Payment Receipt" maxWidth="max-w-lg">
        {selectedReceipt && (
          <div className="space-y-6 p-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">HOSTEL MANAGEMENT SYSTEM</h3>
                <p className="text-xs text-slate-500">Official Fee Payment E-Receipt</p>
              </div>
              <StatusBadge status={selectedReceipt.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase">Transaction ID</span>
                <span className="font-extrabold text-slate-900">{selectedReceipt.transactionId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase">Payment Date</span>
                <span className="font-bold text-slate-800">{selectedReceipt.paymentDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase">Student Name</span>
                <span className="font-bold text-slate-800">Falashree (2024CS1042)</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase">Payment Method</span>
                <span className="font-bold text-slate-800">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Total Paid Amount</span>
              <span className="text-emerald-700 text-base">₹{selectedReceipt.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
