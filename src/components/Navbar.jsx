import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className=" mx-auto px-6 py-4 flex justify-between items-center">
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
          {/* User Info and Logout (when authenticated) */}
          {isAuthenticated && (
            <>
              <div className="text-sm text-gray-600">
                Welcome,{" "}
                <span className="font-medium text-gray-900">
                  {user?.username}
                </span>
                <span className="text-blue-700 ml-1">
                  ({user?.role === "admin" ? "Admin" : "Officer"})
                </span>
              </div>

              {/* Officer Navigation Links */}
              {user?.role === "presiding-officer" && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    All Booths
                  </Link>
                  <Link
                    to="/officer-dashboard"
                    className="px-3 py-1.5 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    My Booth
                  </Link>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-2"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </>
          )}

          {/* Login Link (when not authenticated) */}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="px-4 py-2 text-blue-700 hover:text-blue-800 font-medium transition-colors flex items-center gap-2"
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
              Login
            </Link>
          )}

          {/* Primary Navigation Button */}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
