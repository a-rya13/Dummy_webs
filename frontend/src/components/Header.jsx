import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-wide">⚙️ Admin Dashboard</h1>
      <nav>
        <ul className="flex gap-6">
          <li>
            <NavLink to="/" className="hover:text-yellow-300 transition">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className="hover:text-yellow-300 transition">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
