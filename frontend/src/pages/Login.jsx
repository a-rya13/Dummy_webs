import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, setLogin] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("🔵 Sending request to backend...");
      setLogin(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      setLogin(false);
      const token = res.data.token;

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Toast notification
      toast.success("Login Successful ✅");

      // ✅ Redirect using navigate
      navigate("/admin-dashboard");
    } catch (err) {
      setLogin(false);
      console.error("🔴 Login error:", err.response || err.message);
      const errorMsg = err.response?.data?.message || "Login failed ❌";
      setError(errorMsg);

      // ❌ Show toast error
      toast.error(errorMsg);
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
              onClick={() =>
                toast.info("Forgot password flow not implemented yet.")
              }
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-blue-400 hover:underline hover:text-blue-300 transition"
              onClick={() =>
                toast.info("Change password flow not implemented yet.")
              }
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
