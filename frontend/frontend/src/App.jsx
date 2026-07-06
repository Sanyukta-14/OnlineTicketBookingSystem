import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import UserSidebar from "./components/UserSidebar";
import ProtectedRoute from "./components/ProtectedRoutes";

import Login from "./pages/Login";
import Logout from "./pages/Logout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

import UserDashboard from "./pages/UserDashboard";
import UserEvents from "./pages/UserEvents";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

/* ===========================
   ADMIN LAYOUT
=========================== */

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main
        style={{
          marginLeft: "240px",
          width: "100%",
          minHeight: "100vh",
          background: "#f4f7fb",
          padding: "25px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

/* ===========================
   USER LAYOUT
=========================== */

function UserLayout() {
  return (
    <div style={{ display: "flex" }}>
      <UserSidebar />

      <main
        style={{
          marginLeft: "240px",
          width: "100%",
          minHeight: "100vh",
          background: "#f4f7fb",
          padding: "25px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

/* ===========================
   APP
=========================== */

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Logout */}
      <Route path="/logout" element={<Logout />} />

      {/* ================= ADMIN ================= */}

      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/events" element={<Events />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>

      {/* ================= USER ================= */}

      <Route
        element={
          <ProtectedRoute role="USER">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-events" element={<UserEvents />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Invalid URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;