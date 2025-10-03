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

  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  const timeLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

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

        <StatusLegend />

        <VotingTable
          boothData={boothData}
          timeSlots={timeSlots}
          timeLabels={timeLabels}
          getCellStatus={getCellStatus}
          getStatusColor={getStatusColor}
        />

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
