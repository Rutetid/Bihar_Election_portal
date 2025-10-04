import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Header from "./Header";
import StatusLegend from "./StatusLegend";
import VotingTable from "./VotingTable";
import boothDataJson from "../boothData.json";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

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
  const [boothData, setBoothData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooth, setEditingBooth] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  const timeLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

  // Filter booths based on search term
  const filteredBooths = boothData.filter((booth) =>
    booth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load data from localStorage or use default JSON data
  useEffect(() => {
    const savedData = localStorage.getItem("boothData");
    if (savedData) {
      try {
        setBoothData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved booth data:", error);
        setBoothData(boothDataJson);
      }
    } else {
      setBoothData(boothDataJson);
    }
  }, []);

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

  // Edit functions for admin
  const handleEditBooth = (booth) => {
    if (user?.role !== "admin") return;

    setEditingBooth(booth);
    setEditForm({
      ...booth,
      votes: { ...booth.votes },
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingBooth) return;

    // Validate cumulative vote logic
    const voteEntries = timeSlots
      .map((slot) => ({
        slot,
        value: editForm.votes[slot],
      }))
      .filter((entry) => entry.value !== null);

    // Sort by time and validate cumulative logic
    for (let i = 1; i < voteEntries.length; i++) {
      const currentSlotIndex = timeSlots.indexOf(voteEntries[i].slot);
      const previousSlotIndex = timeSlots.indexOf(voteEntries[i - 1].slot);

      if (
        currentSlotIndex > previousSlotIndex &&
        voteEntries[i].value < voteEntries[i - 1].value
      ) {
        const currentLabel = timeLabels[currentSlotIndex];
        const previousLabel = timeLabels[previousSlotIndex];
        alert(
          `${currentLabel} votes (${
            voteEntries[i].value
          }) cannot be less than ${previousLabel} votes (${
            voteEntries[i - 1].value
          }). Votes are cumulative.`
        );
        return;
      }
    }

    // Validate votes don't exceed total voters
    const voteValues = Object.values(editForm.votes).filter((v) => v !== null);
    const maxVotes = Math.max(...voteValues, 0);

    if (maxVotes > editForm.totalVoters) {
      alert(`Cannot exceed maximum voters (${editForm.totalVoters})`);
      return;
    }

    // Update booth data
    const updatedData = boothData.map((booth) =>
      booth.id === editingBooth.id ? editForm : booth
    );

    // Persist to localStorage
    localStorage.setItem("boothData", JSON.stringify(updatedData));
    setBoothData(updatedData);

    // Trigger refresh in other components (like BoothDetails)
    window.dispatchEvent(new Event("boothDataUpdated"));

    setShowEditModal(false);
    setEditingBooth(null);
    setEditForm({});

    alert("Booth data updated successfully!");
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingBooth(null);
    setEditForm({});
  };

  const handleVoteChange = (timeSlot, value) => {
    const numValue = value === "" ? null : parseInt(value);
    setEditForm({
      ...editForm,
      votes: {
        ...editForm.votes,
        [timeSlot]: numValue,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />

      <div className="mx-auto p-4">
        <Header currentTime={currentTime} />

        {/* Officer Quick Action */}
        {user?.role === "presiding-officer" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Presiding Officer
                </h3>
                <p className="text-sm text-blue-700">
                  Quick access to your assigned booth dashboard
                </p>
              </div>
              <Link
                to="/officer-dashboard"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
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
                Go to My Booth
              </Link>
            </div>
          </div>
        )}

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
            onEditBooth={handleEditBooth}
            user={user}
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

        {/* Edit Modal */}
        {showEditModal && editingBooth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Booth Data
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {editForm.name}
                </h3>
                <p className="text-gray-600">Booth ID: {editForm.id}</p>
                <p className="text-gray-600">
                  Total Voters: {editForm.totalVoters}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    Vote Counts by Time Slot:
                  </h4>
                  <p className="text-sm text-blue-600 mt-1 mb-4">
                    💡 Votes are cumulative - each time slot shows total votes
                    up to that time
                  </p>
                </div>
                {timeSlots.map((slot, index) => {
                  // Calculate minimum value based on previous time slots
                  const previousVotes =
                    index > 0 ? editForm.votes[timeSlots[index - 1]] || 0 : 0;

                  return (
                    <div
                      key={slot}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <label className="font-medium text-gray-700">
                          {timeLabels[index]} ({slot})
                        </label>
                        {index > 0 && previousVotes > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Minimum: {previousVotes} votes
                          </div>
                        )}
                      </div>
                      <input
                        type="number"
                        min={previousVotes}
                        max={editForm.totalVoters}
                        value={editForm.votes[slot] || ""}
                        onChange={(e) => handleVoteChange(slot, e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          previousVotes > 0 ? previousVotes.toString() : "0"
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
