import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowLoginForm(true);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const result = login(
      credentials.username,
      credentials.password,
      selectedRole
    );

    if (result.success) {
      // Navigate based on role
      if (selectedRole === "admin") {
        navigate("/dashboard");
      } else if (selectedRole === "presiding-officer") {
        navigate("/officer-dashboard");
      }
    } else {
      setError(result.error);
    }
  };

  const handleBackToRoles = () => {
    setShowLoginForm(false);
    setSelectedRole("");
    setCredentials({ username: "", password: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          {!showLoginForm ? (
            // Role Selection Card
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Login to Bihar Elections Portal
                </h1>
                <p className="text-gray-600">Select your role to continue</p>
              </div>

              <div className="space-y-4">
                {/* Admin Login Option */}
                <button
                  onClick={() => handleRoleSelection("admin")}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-6 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 rounded-lg p-3">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">Admin Login</h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Presiding Officer Login Option */}
                <button
                  onClick={() => handleRoleSelection("presiding-officer")}
                  className="w-full bg-white hover:bg-blue-50 text-gray-900 border-2 border-blue-700 rounded-xl p-6 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <svg
                        className="w-6 h-6 text-blue-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Presiding Officer Login
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-700 transition-colors ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-700 hover:text-blue-800 font-medium transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          ) : (
            // Login Form
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedRole === "admin"
                    ? "Admin Login"
                    : "Presiding Officer Login"}
                </h1>
                <p className="text-gray-600">
                  Enter your credentials to continue
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Login as{" "}
                  {selectedRole === "admin" ? "Admin" : "Presiding Officer"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  onClick={handleBackToRoles}
                  className="text-blue-700 hover:text-blue-800 font-medium transition-colors"
                >
                  ← Back to Role Selection
                </button>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
