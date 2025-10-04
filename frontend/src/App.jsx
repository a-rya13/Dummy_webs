import React from "react";
import PostDetails from "./components/PostDetails";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./pages/ResetPassword";

// 🔒 Protected Route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // set in Login.jsx
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home page */}
        <Route path="/" element={<Home />} />

        {/* Admin Login page */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
