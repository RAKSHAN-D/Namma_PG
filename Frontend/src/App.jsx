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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="pgs" element={<AllPGs />} />
          <Route path="pgs/:id" element={<ViewPG />} />
          <Route path="owners" element={<Owners />} />
          <Route path="owners/:id" element={<ViewOwner />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<ViewUser />} />
          <Route path="issues" element={<Issues />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
