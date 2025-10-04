import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      setLoading(false);
      toast.success("Password reset successful ✅");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Reset failed ❌");
      console.error(err.response || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-900/80 p-8 rounded-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
