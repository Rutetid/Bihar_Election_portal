import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="8" fill="#1e40af" />
            <path d="M24 12L32 20H28V32H20V20H16L24 12Z" fill="white" />
          </svg>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              BIHAR ELECTIONS
            </h1>
            <p className="text-sm text-gray-600">Serving Citizens of Bihar</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {isHomePage ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="px-6 py-2.5 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
