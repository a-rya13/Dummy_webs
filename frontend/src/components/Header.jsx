// Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove auth data
    localStorage.clear();

    // navigate to login (replace history so user can't go back)
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold transition"
      : "hover:text-yellow-300 transition";

  return (
    <header
      className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      role="banner"
    >
      <h1 className="text-2xl font-bold tracking-wide">⚙️ Admin Dashboard</h1>

      <nav role="navigation" aria-label="Main navigation">
        <ul className="flex gap-6 items-center">
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>

          {/* add more nav items here if needed */}
          <li>
            <button
              onClick={handleLogout}
              className="text-white hover:text-yellow-300 transition px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="Log out"
              title="Log out"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
