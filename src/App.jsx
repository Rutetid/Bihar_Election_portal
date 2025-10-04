import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import BoothDetails from "./components/BoothDetails";
import Login from "./components/Login";
import OfficerDashboard from "./components/OfficerDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booth/:boothId" element={<BoothDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
