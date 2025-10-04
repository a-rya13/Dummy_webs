import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChangePassword from "../components/ChangePassword";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLogin(true);
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      setLogin(false);

      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful ✅");
      navigate("/admin-dashboard");
    } catch (err) {
      setLogin(false);
      console.error("Login error:", err.response || err.message);
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.warning("Please enter your registered email ⚠️");
      return;
    }
    try {
      setSendingEmail(true);
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
      setSendingEmail(false);
      toast.success("Password reset link sent to your email ✅");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      setSendingEmail(false);
      console.error("Forgot password error:", err.response || err.message);
      toast.error(err.response?.data?.message || "Error sending email ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Login Card */}
      <div className="bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white tracking-wide">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 shadow-md"
          >
            {login ? "Loading..." : "Login"}
          </button>

          {/* Extra buttons */}
          <div className="flex justify-between pt-4 text-sm">
            <button
              type="button"
              className="text-blue-400 hover:underline hover:text-blue-300 transition"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-blue-400 hover:underline hover:text-blue-300 transition"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* ================= Change Password Modal ================= */}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}

      {/* ================= Forgot Password Modal ================= */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white text-center">
              Forgot Password
            </h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                disabled={sendingEmail}
              >
                {sendingEmail ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
