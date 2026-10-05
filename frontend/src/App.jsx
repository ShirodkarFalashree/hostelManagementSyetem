import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import WardenLayout from "./layouts/WardenLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AccessDenied from "./pages/auth/AccessDenied";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentApplication from "./pages/student/Application";
import StudentRoom from "./pages/student/Room";
import StudentFees from "./pages/student/Fees";
import StudentVisitors from "./pages/student/Visitors";
import StudentComplaints from "./pages/student/Complaints";
import StudentNotifications from "./pages/student/Notifications";

// Warden Pages
import WardenDashboard from "./pages/warden/Dashboard";
import WardenApplications from "./pages/warden/Applications";
import WardenRooms from "./pages/warden/Rooms";
import WardenOccupancy from "./pages/warden/Occupancy";
import WardenComplaints from "./pages/warden/Complaints";
import WardenMaintenance from "./pages/warden/Maintenance";
import WardenVisitors from "./pages/warden/Visitors";

// Staff Pages
import StaffDashboard from "./pages/staff/Dashboard";
import StaffVisitors from "./pages/staff/Visitors";
import StaffMaintenance from "./pages/staff/Maintenance";
import StaffComplaints from "./pages/staff/Complaints";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminHostels from "./pages/admin/Hostels";
import AdminFees from "./pages/admin/Fees";
import AdminReports from "./pages/admin/Reports";
import AdminAuditLogs from "./pages/admin/AuditLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* STUDENT ROUTES */}
        <Route
          path="/student/dashboard"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />
        <Route
          path="/student/application"
          element={
            <StudentLayout>
              <StudentApplication />
            </StudentLayout>
          }
        />
        <Route
          path="/student/room"
          element={
            <StudentLayout>
              <StudentRoom />
            </StudentLayout>
          }
        />
        <Route
          path="/student/fees"
          element={
            <StudentLayout>
              <StudentFees />
            </StudentLayout>
          }
        />
        <Route
          path="/student/visitors"
          element={
            <StudentLayout>
              <StudentVisitors />
            </StudentLayout>
          }
        />
        <Route
          path="/student/complaints"
          element={
            <StudentLayout>
              <StudentComplaints />
            </StudentLayout>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <StudentLayout>
              <StudentNotifications />
            </StudentLayout>
          }
        />

        {/* WARDEN ROUTES */}
        <Route
          path="/warden/dashboard"
          element={
            <WardenLayout>
              <WardenDashboard />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/applications"
          element={
            <WardenLayout>
              <WardenApplications />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/rooms"
          element={
            <WardenLayout>
              <WardenRooms />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/occupancy"
          element={
            <WardenLayout>
              <WardenOccupancy />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/complaints"
          element={
            <WardenLayout>
              <WardenComplaints />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/maintenance"
          element={
            <WardenLayout>
              <WardenMaintenance />
            </WardenLayout>
          }
        />
        <Route
          path="/warden/visitors"
          element={
            <WardenLayout>
              <WardenVisitors />
            </WardenLayout>
          }
        />

        {/* STAFF ROUTES */}
        <Route
          path="/staff/dashboard"
          element={
            <StaffLayout>
              <StaffDashboard />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/visitors"
          element={
            <StaffLayout>
              <StaffVisitors />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/check-in-out"
          element={
            <StaffLayout>
              <StaffVisitors />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/maintenance"
          element={
            <StaffLayout>
              <StaffMaintenance />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/complaints"
          element={
            <StaffLayout>
              <StaffComplaints />
            </StaffLayout>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/hostels"
          element={
            <AdminLayout>
              <AdminHostels />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminLayout>
              <WardenRooms />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <AdminLayout>
              <WardenApplications />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <AdminLayout>
              <AdminFees />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <AdminLayout>
              <WardenComplaints />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/maintenance"
          element={
            <AdminLayout>
              <WardenMaintenance />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/visitors"
          element={
            <AdminLayout>
              <WardenVisitors />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminLayout>
              <AdminReports />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <AdminLayout>
              <AdminAuditLogs />
            </AdminLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;