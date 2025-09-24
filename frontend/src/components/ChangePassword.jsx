import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ChangePassword({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("New passwords do not match ❌");
      return;
    }

    try {
      const username = localStorage.getItem("adminUsername"); // ✅ save username during login
      if (!username) {
        toast.error("User not found. Please login again.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          username: username.trim(),
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim(),
        }
      );

      toast.success(res.data.message);
      onClose();
    } catch (err) {
      console.error(
        "❌ Error changing password:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">
          🔑 Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
