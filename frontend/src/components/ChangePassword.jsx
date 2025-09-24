// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// function ChangePassword({ onClose }) {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const[username,setusername]=useState("");

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (newPassword.trim() !== confirmPassword.trim()) {
//       toast.error("New passwords do not match ❌");
//       return;
//     }

//     try {
//        // ✅ save username during login
//       if (!username) {
//         toast.error("User not found. Please login again.");
//         return;
//       }

//       const res = await axios.post(
//         "http://localhost:5000/api/auth/change-password",
//         {
//           username: username.trim(),
//           oldPassword: oldPassword.trim(),
//           newPassword: newPassword.trim(),
//           confirmPassword: confirmPassword.trim(),
//         }
//       );

//       toast.success(res.data.message);
//       onClose();
//     } catch (err) {
//       console.error(
//         "❌ Error changing password:",
//         err.response?.data || err.message
//       );
//       toast.error(err.response?.data?.message || "Failed to change password");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
//       <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700">
//         <h2 className="text-xl font-bold text-yellow-300 mb-4">
//           🔑 Change Password
//         </h2>

//         <form onSubmit={handleChangePassword} className="space-y-4">
//           <input
//             type="text"
//             placeholder="user name"
//             value={username}
//             onChange={(e) => setusername(e.target.value)}
//             required
//             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
//           />
//           <input
//             type="password"
//             placeholder="Old Password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             required
//             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
//           />
//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
//           />
//           <input
//             type="password"
//             placeholder="Confirm New Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
//           />

//           <div className="flex justify-between mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
//             >
//               Update Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChangePassword;
// ChangePassword.jsx
import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Small presentational password field that is stable across renders.
 * - value/onChange are passed through (controlled input)
 * - show toggles visibility
 * - onMouseDown prevents default so the input doesn't lose focus
 */
function PasswordField({ value, onChange, placeholder, show, setShow, required = true }) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={placeholder}
        autoComplete="current-password"
      />

      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        onMouseDown={(e) => e.preventDefault()} // keep focus in input
        aria-pressed={show}
        aria-label={show ? `Hide ${placeholder}` : `Show ${placeholder}`}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {show ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-10-8 0-.667.104-1.31.298-1.925M3 3l18 18" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.88 9.88A3 3 0 0114.12 14.12" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.58 6.58A10.02 10.02 0 0121 11c-1 4.5-5 8-9 8a10.05 10.05 0 01-1.75-.15" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function ChangePassword({ onClose }) {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // visibility toggles
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // useCallback to keep handlers stable (helps avoid focus/jump issues)
  const handleOldChange = useCallback((e) => setOldPassword(e.target.value), []);
  const handleNewChange = useCallback((e) => setNewPassword(e.target.value), []);
  const handleConfirmChange = useCallback((e) => setConfirmPassword(e.target.value), []);
  const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("New passwords do not match ❌");
      return;
    }

    try {
      if (!username) {
        toast.error("User not found. Please login again.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/auth/change-password", {
        username: username.trim(),
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      toast.success(res.data.message || "Password changed");
      onClose && onClose();
    } catch (err) {
      console.error("❌ Error changing password:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">🔑 Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="text"
            placeholder="user name"
            value={username}
            onChange={handleUsernameChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <PasswordField
            value={oldPassword}
            onChange={handleOldChange}
            placeholder="Old Password"
            show={showOld}
            setShow={setShowOld}
          />

          <PasswordField
            value={newPassword}
            onChange={handleNewChange}
            placeholder="New Password"
            show={showNew}
            setShow={setShowNew}
          />

          <PasswordField
            value={confirmPassword}
            onChange={handleConfirmChange}
            placeholder="Confirm New Password"
            show={showConfirm}
            setShow={setShowConfirm}
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
