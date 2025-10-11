import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import boothDataJson from "../boothData.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // All state declarations at the top
  const [assignedBoothId, setAssignedBoothId] = useState(null);
  const [boothData, setBoothData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTime] = useState(() => {
    const time = new Date();
    time.setHours(14, 12, 0, 0);
    return time;
  });

  // Load booth data from localStorage or default JSON
  useEffect(() => {
    if (!assignedBoothId) return;

    const savedData = localStorage.getItem("boothData");
    let allBooths;

    if (savedData) {
      try {
        allBooths = JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing saved booth data:", error);
        allBooths = boothDataJson;
      }
    } else {
      allBooths = boothDataJson;
    }

    const assignedBooth = allBooths.find(
      (booth) => booth.id === assignedBoothId
    );
    // assignedBoothId = 1;
    if (assignedBooth) {
      setBoothData(assignedBooth);

      // Prepare chart data
      const data = timeSlots.map((slot, index) => ({
        time: timeLabels[index],
        cumulativeVotes: assignedBooth.votes[slot],
      }));
      setChartData(data);
    }
  }, [assignedBoothId]);

  // Set booth assignment when user is loaded
  useEffect(() => {
    if (user?.username && assignedBoothId === null) {
      // Try to get assigned booth from localStorage first
      const savedAssignment = localStorage.getItem(
        `officerBooth_${user.username}`
      );
      if (savedAssignment) {
        setAssignedBoothId(parseInt(savedAssignment));
      } else {
        // If no assignment exists, create one and save it
        const randomIndex = Math.floor(Math.random() * boothDataJson.length);
        const boothId = boothDataJson[randomIndex].id;
        localStorage.setItem(
          `officerBooth_${user.username}`,
          boothId.toString()
        );
        setAssignedBoothId(boothId);
      }
    }
  }, [user?.username, assignedBoothId]);

  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  const timeLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

  // Edit functions
  const handleEditBooth = () => {
    setEditForm({
      ...boothData,
      votes: { ...boothData.votes },
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
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

    // Update booth data and persist to localStorage
    const savedData = localStorage.getItem("boothData");
    if (savedData) {
      try {
        const allBoothData = JSON.parse(savedData);
        const updatedData = allBoothData.map((booth) =>
          booth.id === editForm.id ? editForm : booth
        );
        localStorage.setItem("boothData", JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error updating saved data:", error);
      }
    }

    setBoothData(editForm);

    // Update chart data
    const data = timeSlots.map((slot, index) => ({
      time: timeLabels[index],
      cumulativeVotes: editForm.votes[slot],
    }));
    setChartData(data);

    // Trigger refresh in other components (like BoothDetails)
    window.dispatchEvent(new Event("boothDataUpdated"));

    setShowEditModal(false);
    setEditForm({});

    alert("Booth data updated successfully!");
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
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

  const getCellStatus = (timeSlot, voteCount) => {
    const now = new Date();
    now.setHours(14, 12, 0, 0);
    const [hours, minutes] = timeSlot.split(":");
    const slotTime = new Date();
    slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const timeDiff = now - slotTime;
    const minutesDiff = timeDiff / (1000 * 60);

    if (voteCount !== null) {
      return "received";
    } else if (minutesDiff < 0) {
      return "future";
    } else if (minutesDiff > 15) {
      return "overdue";
    } else {
      return "pending";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "future":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated || user?.role !== "presiding-officer") {
    return null; // Will redirect via useEffect
  }

  if (!boothData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            Loading your assigned booth...
          </div>
        </div>
      </div>
    );
  }

  // Calculate total votes cast
  const voteValues = Object.values(boothData.votes).filter((v) => v !== null);
  const totalVotesCast = voteValues.length > 0 ? Math.max(...voteValues) : 0;
  const turnoutPercentage = (
    (totalVotesCast / boothData.totalVoters) *
    100
  ).toFixed(1);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Presiding Officer Dashboard
              </h1>
              <p className="text-gray-600">Your assigned booth monitoring</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Current Time</div>
              <div className="text-lg font-semibold text-blue-700">
                {currentTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          </div>

          {/* Booth Info Card */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {boothData.name}
                </h2>
                <p className="text-gray-600 mb-4">Booth ID: {boothData.id}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Voters
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {boothData.totalVoters.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Votes Cast</div>
                    <div className="text-2xl font-bold text-green-700">
                      {totalVotesCast.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Turnout</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {turnoutPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEditBooth}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update Data
              </button>
            </div>
          </div>
        </div>

        {/* Voting Timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Voting Timeline
          </h3>

          {/* Voting Trend Chart */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Cumulative Voting Trend
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  style={{ fontSize: "14px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "14px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="cumulativeVotes"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  dot={{ fill: "#1d4ed8", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Cumulative Votes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {timeSlots.map((slot, index) => {
              const voteCount = boothData.votes[slot];
              const status = getCellStatus(slot, voteCount);
              const statusColor = getStatusColor(status);

              return (
                <div
                  key={slot}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {timeLabels[index]}
                      </div>
                      <div className="text-sm text-gray-500">{slot}</div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                    >
                      {status === "received"
                        ? "Reported"
                        : status === "pending"
                        ? "Pending"
                        : status === "overdue"
                        ? "Overdue"
                        : "Future"}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">
                      {voteCount !== null ? voteCount.toLocaleString() : "—"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {voteCount !== null
                        ? `${(
                            (voteCount / boothData.totalVoters) *
                            100
                          ).toFixed(1)}% turnout`
                        : "No data yet"}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-700 h-2 rounded-full transition-all"
                      style={{
                        width: voteCount
                          ? `${(voteCount / boothData.totalVoters) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleEditBooth}
              className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Update Vote Counts
                  </div>
                  <div className="text-sm text-gray-600">
                    Enter current voting data
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/booth/${boothData.id}`)}
              className="p-4 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-700"
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
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    View Analytics
                  </div>
                  <div className="text-sm text-gray-600">
                    See detailed voting trends
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div> */}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Update Booth Data
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
                    index > 0 ? editForm.votes?.[timeSlots[index - 1]] || 0 : 0;

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
                        value={editForm.votes?.[slot] || ""}
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

export default OfficerDashboard;
