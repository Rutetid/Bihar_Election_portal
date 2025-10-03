import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import StatusLegend from "./StatusLegend";
import VotingTable from "./VotingTable";
import boothDataJson from "../boothData.json";

const Dashboard = () => {
  // Set current time to 2:12 PM
  const [currentTime, setCurrentTime] = useState(() => {
    const time = new Date();
    time.setHours(14, 12, 0, 0);
    return time;
  });
  const [lastUpdate, setLastUpdate] = useState(() => {
    const time = new Date();
    time.setHours(14, 12, 0, 0);
    return time;
  });
  const [boothData] = useState(boothDataJson);
  const [searchTerm, setSearchTerm] = useState("");

  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  const timeLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

  // Filter booths based on search term
  const filteredBooths = boothData.filter((booth) =>
    booth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh every 2 hours
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setLastUpdate(new Date());
      // Here you would call your API to fetch new data
      console.log("Refreshing data...");
    }, 2 * 60 * 60 * 1000); // 2 hours

    return () => clearInterval(refreshTimer);
  }, []);

  const getCellStatus = (timeSlot, voteCount) => {
    const now = new Date();
    now.setHours(14, 12, 0, 0); // Set to 2:12 PM
    const [hours, minutes] = timeSlot.split(":");
    const slotTime = new Date();
    slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const timeDiff = now - slotTime;
    const minutesDiff = timeDiff / (1000 * 60);

    if (voteCount !== null) {
      return "received"; // Green - data received
    } else if (minutesDiff < 0) {
      return "future"; // Gray - future time slot
    } else if (minutesDiff > 15) {
      return "overdue"; // Red - overdue (15+ minutes late)
    } else {
      return "pending"; // Yellow - within 15 minutes
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "received":
        return "vote-cell-received";
      case "pending":
        return "vote-cell-pending";
      case "overdue":
        return "vote-cell-overdue";
      case "future":
        return "vote-cell-future";
      default:
        return "vote-cell-pending";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Bihar Elections
              </h1>
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto p-4">
        <Header currentTime={currentTime} />

        {/* Search Bar */}

        <div>
          <p className="text-xs text-gray-500 text-end mb-5 pr-2">
            Last Updated:{" "}
            {lastUpdate.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex justify-between">
          <div className=" mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by booth name... (e.g., Booth 001, Muzaffarpur)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                Found {filteredBooths.length} booth
                {filteredBooths.length !== 1 ? "s" : ""} matching "{searchTerm}"
              </p>
            )}
          </div>
          <StatusLegend />
        </div>

        {filteredBooths.length > 0 ? (
          <VotingTable
            boothData={filteredBooths}
            timeSlots={timeSlots}
            timeLabels={timeLabels}
            getCellStatus={getCellStatus}
            getStatusColor={getStatusColor}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No booths found
            </h3>
            <p className="text-gray-500">
              No booths match your search "{searchTerm}". Try a different search
              term.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-xs font-medium mb-1">
            Auto-refresh every 2 hours | Real-time election monitoring
          </p>
          <p className="text-xs">
            Bihar State Election Commission | भारत निर्वाचन आयोग
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
