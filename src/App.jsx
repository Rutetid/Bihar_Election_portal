import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import BoothDetails from "./components/BoothDetails";
import Login from "./components/Login";
import OfficerDashboard from "./components/OfficerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer-dashboard"
            element={
              <ProtectedRoute requiredRole="presiding-officer">
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booth/:boothId"
            element={
              <ProtectedRoute>
                <BoothDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
