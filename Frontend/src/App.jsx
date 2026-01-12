import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AllPGs from "./pages/admin/AllPGs";
import Owners from "./pages/admin/Owners";
import UsersPage from "./pages/admin/Users";
import Issues from "./pages/admin/Issues";
import ViewPG from "./pages/admin/ViewPG";
import ViewUser from "./pages/admin/ViewUser";
import ViewOwner from "./pages/admin/ViewOwner";
import Approvals from "./pages/admin/Approvals";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboardHome from "./pages/owner/DashboardHome";
import OwnerMyPGs from "./pages/owner/MyPGs";
import OwnerPGDetail from "./pages/owner/PGDetail";
import OwnerAnalytics from "./pages/owner/Analytics";
import OwnerSettings from "./pages/owner/Settings";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/owner-dashboard" element={<Navigate to="/owner/dashboard" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="pgs" element={<AllPGs />} />
          <Route path="pgs/:id" element={<ViewPG />} />
          <Route path="owners" element={<Owners />} />
          <Route path="owners/:id" element={<ViewOwner />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<ViewUser />} />
          <Route path="issues" element={<Issues />} />
        </Route>

        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<OwnerDashboardHome />} />
          <Route path="pgs" element={<OwnerMyPGs />} />
          <Route path="pgs/:id" element={<OwnerPGDetail />} />
          <Route path="analytics" element={<OwnerAnalytics />} />
          <Route path="settings" element={<OwnerSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
