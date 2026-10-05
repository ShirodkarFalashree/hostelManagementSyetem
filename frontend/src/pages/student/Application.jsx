import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  PhoneCall,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Send,
  Eye,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { Store } from "../../services/store";

const STEPS = [
  { id: 1, name: "Personal Details", icon: User },
  { id: 2, name: "Academic & Category", icon: GraduationCap },
  { id: 3, name: "Emergency Contact", icon: PhoneCall },
  { id: 4, name: "Hostel Preference", icon: Building2 },
  { id: 5, name: "Documents", icon: FileCheck },
];

export default function StudentApplication() {
  const [activeStep, setActiveStep] = useState(1);
  const [existingApp, setExistingApp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
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
    emergencyName: "Ramesh Sharma",
    emergencyRelation: "Father",
    emergencyPhone: "+91 9811223344",
    emergencyAddress: "42 Park Street, Indiranagar, Bengaluru",
    hostelPreference: "Hostel B (Girls Hostel)",
    roomTypePreference: "Double Shared - AC",
    idProof: "Aadhaar_Card_Falashree.pdf",
    admissionLetter: "Admission_Letter_2024.pdf",
    categoryCert: "",
    photo: "Student_Photo.jpg",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadExistingApplication();
  }, []);

  const loadExistingApplication = () => {
    const apps = Store.getApplications();
    const current = apps.find((a) => a.studentId === "STU-1042");
    if (current) {
      setExistingApp(current);
      if (current.status === "DRAFT") {
        setFormData({
          fullName: current.fullName || "Falashree",
          email: current.email || "falashree@university.edu",
          phone: current.phone || "",
          dob: current.dob || "",
          gender: current.gender || "Female",
          bloodGroup: current.bloodGroup || "O+",
          permanentAddress: current.permanentAddress || "",
          rollNo: current.rollNo || "2024CS1042",
          course: current.course || "B.Tech Computer Science",
          branch: current.branch || "CSE",
          year: current.year || "3rd Year",
          cgpa: current.cgpa || "",
          category: current.category || "General",
          emergencyName: current.emergencyContact?.name || "",
          emergencyRelation: current.emergencyContact?.relation || "",
          emergencyPhone: current.emergencyContact?.phone || "",
          emergencyAddress: current.emergencyContact?.address || "",
          hostelPreference: current.hostelPreference || "Hostel B (Girls Hostel)",
          roomTypePreference: current.roomTypePreference || "Double Shared - AC",
          idProof: current.documents?.idProof || "",
          admissionLetter: current.documents?.admissionLetter || "",
          categoryCert: current.documents?.categoryCert || "",
          photo: current.documents?.photo || "",
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.permanentAddress.trim()) newErrors.permanentAddress = "Address is required";
    } else if (step === 2) {
      if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
      if (!formData.course.trim()) newErrors.course = "Course is required";
      if (!formData.cgpa.trim()) newErrors.cgpa = "CGPA / Percentage is required";
    } else if (step === 3) {
      if (!formData.emergencyName.trim()) newErrors.emergencyName = "Contact name is required";
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Contact phone is required";
    } else if (step === 4) {
      if (!formData.hostelPreference) newErrors.hostelPreference = "Please select hostel preference";
      if (!formData.roomTypePreference) newErrors.roomTypePreference = "Please select room type";
    } else if (step === 5) {
      if (!formData.idProof) newErrors.idProof = "Government ID proof is required";
      if (!formData.admissionLetter) newErrors.admissionLetter = "Admission letter is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveDraft = () => {
    setIsLoading(true);
    setTimeout(() => {
      const draftApp = {
        id: existingApp?.id || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: "STU-1042",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        permanentAddress: formData.permanentAddress,
        rollNo: formData.rollNo,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        cgpa: formData.cgpa,
        category: formData.category,
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone,
          address: formData.emergencyAddress,
        },
        hostelPreference: formData.hostelPreference,
        roomTypePreference: formData.roomTypePreference,
        documents: {
          idProof: formData.idProof || "Id_Proof_Draft.pdf",
          admissionLetter: formData.admissionLetter || "Admission_Draft.pdf",
          categoryCert: formData.categoryCert || "",
          photo: formData.photo || "Photo_Draft.jpg",
        },
        status: "DRAFT",
        submissionDate: new Date().toLocaleString(),
        remarks: "Draft saved by student.",
        timeline: [
          { title: "Draft Saved", date: new Date().toLocaleString(), status: "COMPLETED", remarks: "Progress saved" },
        ],
      };

      Store.saveApplication(draftApp);
      setIsLoading(false);
      loadExistingApplication();
      showNotification("Application saved as DRAFT successfully!");
    }, 600);
  };

  const handleSubmitApplication = () => {
    if (!validateStep(5)) return;
    setIsLoading(true);
    setTimeout(() => {
      const newAppId = existingApp?.id && existingApp.status === "DRAFT" ? existingApp.id : `APP-2026-00${Math.floor(45 + Math.random() * 50)}`;
      const finalApp = {
        id: newAppId,
        studentId: "STU-1042",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        permanentAddress: formData.permanentAddress,
        rollNo: formData.rollNo,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        cgpa: formData.cgpa,
        category: formData.category,
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone,
          address: formData.emergencyAddress,
        },
        hostelPreference: formData.hostelPreference,
        roomTypePreference: formData.roomTypePreference,
        documents: {
          idProof: formData.idProof || "Govt_ID_Verified.pdf",
          admissionLetter: formData.admissionLetter || "Admission_Verified.pdf",
          categoryCert: formData.categoryCert || "Category_Certificate.pdf",
          photo: formData.photo || "Student_Photo.jpg",
        },
        status: "SUBMITTED",
        submissionDate: new Date().toLocaleString(),
        remarks: "Application submitted and queued for Warden review.",
        timeline: [
          { title: "Application Form Submitted", date: new Date().toLocaleString(), status: "COMPLETED", remarks: "All documents verified" },
          { title: "Under Review by Warden", date: "Pending", status: "IN_PROGRESS", remarks: "Document & Eligibility check" },
          { title: "Approval & Allocation", date: "Pending", status: "PENDING", remarks: "Pending room assignment" },
        ],
      };

      Store.saveApplication(finalApp);
      setIsLoading(false);
      setShowConfirmModal(false);
      loadExistingApplication();
      showNotification(`Application ${newAppId} submitted successfully!`);
    }, 800);
  };

  const isSubmittedOrFinal = existingApp && existingApp.status !== "DRAFT";

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
          <h1 className="text-2xl font-bold text-slate-900">Hostel Application</h1>
          <p className="mt-1 text-sm text-slate-500">
            Apply for hostel accommodation, track status, or update your submitted preferences.
          </p>
        </div>

        {existingApp && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Current Status:</span>
            <StatusBadge status={existingApp.status} />
            <button
              onClick={() => setShowViewModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        )}
      </div>

      {/* Main Status Timeline Card if Application Exists */}
      {existingApp && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Application No:</span>
                <span className="font-extrabold text-slate-900 text-base">{existingApp.id}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Submitted on: {existingApp.submissionDate}</p>
            </div>
            {existingApp.allocatedRoom && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-emerald-800 text-xs font-bold">
                <CheckCircle2 size={16} />
                <span>Allocated: {existingApp.allocatedRoom} ({existingApp.allocatedBed})</span>
              </div>
            )}
          </div>

          {/* Timeline Visual Progress */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Application Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { stage: "Submitted", status: ["SUBMITTED", "UNDER REVIEW", "APPROVED", "WAITLISTED", "ALLOCATED"].includes(existingApp.status) },
                { stage: "Under Review", status: ["UNDER REVIEW", "APPROVED", "WAITLISTED", "ALLOCATED"].includes(existingApp.status) },
                { stage: "Decision", status: ["APPROVED", "WAITLISTED", "ALLOCATED"].includes(existingApp.status) },
                { stage: "Room Allocated", status: ["ALLOCATED"].includes(existingApp.status) },
                { stage: "Check-in Ready", status: ["ALLOCATED"].includes(existingApp.status) },
              ].map((step, idx) => (
                <div key={idx} className={`relative flex items-center gap-3 p-3 rounded-xl border ${step.status ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step.status ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {step.status ? "✓" : idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{step.stage}</p>
                    <span className="text-[10px] font-medium opacity-80">{step.status ? "Completed" : "Pending"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Form */}
      {(!isSubmittedOrFinal || existingApp?.status === "DRAFT") && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Step Indicator Header */}
          <div className="border-b border-slate-100 bg-slate-50/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isDone = activeStep > step.id;

                return (
                  <div
                    key={step.id}
                    onClick={() => validateStep(activeStep) && setActiveStep(step.id)}
                    className={`flex items-center gap-3 cursor-pointer transition ${
                      isActive
                        ? "text-slate-900 font-bold"
                        : isDone
                        ? "text-emerald-600 font-semibold"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-semibold text-slate-400">Step 0{step.id}</p>
                      <p className="text-xs whitespace-nowrap">{step.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {isLoading && <Loader text="Saving application state..." />}

            {!isLoading && (
              <>
                {/* STEP 1: Personal Details */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                      <p className="text-xs text-slate-500">Provide your basic personal & contact information.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none transition ${
                            errors.fullName ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                        {errors.fullName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          University Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none transition ${
                            errors.email ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Mobile Phone *
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none transition ${
                            errors.phone ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Permanent Address *
                        </label>
                        <textarea
                          rows={3}
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none transition ${
                            errors.permanentAddress ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                        {errors.permanentAddress && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.permanentAddress}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Academic Details */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Academic & Category Information</h2>
                      <p className="text-xs text-slate-500">Provide course and quota eligibility details.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Student Roll Number *
                        </label>
                        <input
                          type="text"
                          name="rollNo"
                          value={formData.rollNo}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Course / Degree Program *
                        </label>
                        <input
                          type="text"
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Branch / Specialization
                        </label>
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Year of Study
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="PG / PhD">PG / PhD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Latest CGPA / Percentage *
                        </label>
                        <input
                          type="text"
                          name="cgpa"
                          value={formData.cgpa}
                          onChange={handleInputChange}
                          placeholder="e.g. 8.85"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Reservation Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Emergency Contact */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Emergency Contact Details</h2>
                      <p className="text-xs text-slate-500">Parent or guardian contact information for urgent reach.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Guardian / Parent Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyName"
                          value={formData.emergencyName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Relationship *
                        </label>
                        <input
                          type="text"
                          name="emergencyRelation"
                          value={formData.emergencyRelation}
                          onChange={handleInputChange}
                          placeholder="Father / Mother / Guardian"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Emergency Contact Number *
                        </label>
                        <input
                          type="text"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Emergency Address
                        </label>
                        <textarea
                          rows={2}
                          name="emergencyAddress"
                          value={formData.emergencyAddress}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Hostel Preference */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Hostel & Room Preferences</h2>
                      <p className="text-xs text-slate-500">Select your preferred block and room type option.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Hostel Preference *
                        </label>
                        <select
                          name="hostelPreference"
                          value={formData.hostelPreference}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="Hostel A (Boys Hostel)">Hostel A (Boys Hostel)</option>
                          <option value="Hostel B (Girls Hostel)">Hostel B (Girls Hostel)</option>
                          <option value="Hostel C (PG / Research Hostel)">Hostel C (PG / Research)</option>
                          <option value="Hostel D (International Hostel)">Hostel D (International)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Room Type Preference *
                        </label>
                        <select
                          name="roomTypePreference"
                          value={formData.roomTypePreference}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-800 focus:outline-none transition bg-white"
                        >
                          <option value="Single Room - AC">Single Room - AC (₹45,000 / Sem)</option>
                          <option value="Single Room - Non AC">Single Room - Non AC (₹35,000 / Sem)</option>
                          <option value="Double Shared - AC">Double Shared - AC (₹28,000 / Sem)</option>
                          <option value="Double Shared - Non AC">Double Shared - Non AC (₹22,000 / Sem)</option>
                          <option value="Triple Shared - Non AC">Triple Shared - Non AC (₹18,000 / Sem)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Document Uploads */}
                {activeStep === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Document Uploads</h2>
                      <p className="text-xs text-slate-500">Upload identity, admission proof, and recent photograph.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Document Item 1 */}
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 hover:border-slate-800 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Government ID Proof *</span>
                          {formData.idProof && <span className="text-xs font-semibold text-emerald-600">Attached ✓</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Aadhaar Card, Passport, or Voter ID (PDF/JPG)</p>
                        <input
                          type="text"
                          name="idProof"
                          value={formData.idProof}
                          onChange={handleInputChange}
                          placeholder="File name e.g. Aadhaar_Card.pdf"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* Document Item 2 */}
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 hover:border-slate-800 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Admission Letter *</span>
                          {formData.admissionLetter && <span className="text-xs font-semibold text-emerald-600">Attached ✓</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Official Allotment/Admission Letter (PDF)</p>
                        <input
                          type="text"
                          name="admissionLetter"
                          value={formData.admissionLetter}
                          onChange={handleInputChange}
                          placeholder="File name e.g. Admission_Letter.pdf"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* Document Item 3 */}
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 hover:border-slate-800 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Photo *</span>
                          {formData.photo && <span className="text-xs font-semibold text-emerald-600">Attached ✓</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Passport size photograph (JPG/PNG)</p>
                        <input
                          type="text"
                          name="photo"
                          value={formData.photo}
                          onChange={handleInputChange}
                          placeholder="File name e.g. Passport_Photo.jpg"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* Document Item 4 */}
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 hover:border-slate-800 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Category Certificate (Optional)</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Required for OBC/SC/ST/EWS quota claim</p>
                        <input
                          type="text"
                          name="categoryCert"
                          value={formData.categoryCert}
                          onChange={handleInputChange}
                          placeholder="File name e.g. Category_Certificate.pdf"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Navigation Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={activeStep === 1}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <Save size={16} /> Save as Draft
                    </button>

                    {activeStep < 5 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition"
                      >
                        Next Step <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition"
                      >
                        <Send size={16} /> Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Application Details Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`Application Details (${existingApp?.id})`}>
        {existingApp && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">Student Roll No</p>
                <p className="text-sm font-bold text-slate-900">{existingApp.rollNo}</p>
              </div>
              <StatusBadge status={existingApp.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Full Name</span>
                <span className="font-bold text-slate-800">{existingApp.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Email</span>
                <span className="font-bold text-slate-800">{existingApp.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Phone</span>
                <span className="font-bold text-slate-800">{existingApp.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Course & Year</span>
                <span className="font-bold text-slate-800">{existingApp.course} ({existingApp.year})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Hostel Preference</span>
                <span className="font-bold text-slate-800">{existingApp.hostelPreference}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Room Preference</span>
                <span className="font-bold text-slate-800">{existingApp.roomTypePreference}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Uploaded Documents</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-medium text-slate-700">Govt ID Proof: {existingApp.documents?.idProof}</span>
                  <span className="text-emerald-600 font-bold">Verified ✓</span>
                </li>
                <li className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-medium text-slate-700">Admission Letter: {existingApp.documents?.admissionLetter}</span>
                  <span className="text-emerald-600 font-bold">Verified ✓</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirm Application Submission" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to submit your hostel application? Once submitted, your details will be locked for Warden verification.
          </p>
          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 font-medium">
            ⚠️ Please ensure all uploaded document names match your registered official documents.
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitApplication}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
