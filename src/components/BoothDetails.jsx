import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const BoothDetails = () => {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const [booth, setBooth] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Load booth data from localStorage or fallback to JSON
    const loadBoothData = () => {
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

      return allBooths;
    };

    // Find the booth data - convert boothId from string to number
    const allBooths = loadBoothData();
    const foundBooth = allBooths.find((b) => b.id === parseInt(boothId));

    if (foundBooth) {
      setBooth(foundBooth);

      // Prepare chart data - votes are already cumulative
      const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
      const timeLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

      const data = timeSlots.map((slot, index) => ({
        time: timeLabels[index],
        cumulativeVotes: foundBooth.votes[slot], // Keep null as null
      }));

      setChartData(data);
    }
  }, [boothId, refreshTrigger]);

  // Listen for localStorage changes (when data is updated from other components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "boothData") {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomRefresh = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("boothDataUpdated", handleCustomRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("boothDataUpdated", handleCustomRefresh);
    };
  }, []);

  if (!booth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booth Not Found
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get the latest cumulative vote count (not sum of all values)
  const voteValues = Object.values(booth.votes).filter((v) => v !== null);
  const totalVotes = voteValues.length > 0 ? Math.max(...voteValues) : 0;
  const turnoutPercentage = ((totalVotes / booth.totalVoters) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Booth Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {booth.name}
              </h1>
              <p className="text-gray-600">Booth ID: {booth.id}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-700 mb-1">
                {turnoutPercentage}%
              </div>
              <div className="text-sm text-gray-600">Voter Turnout</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Total Voters</div>
              <div className="text-2xl font-bold text-gray-900">
                {booth.totalVoters.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Votes Cast</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalVotes.toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Remaining</div>
              <div className="text-2xl font-bold text-gray-900">
                {(booth.totalVoters - totalVotes).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Voting Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Cumulative Voting Trend Throughout the Day
          </h2>

          <ResponsiveContainer width="100%" height={400}>
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

        {/* Time Slot Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Time Slot Breakdown
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {chartData.map((slot, index) => {
              const currentVotes = slot.cumulativeVotes;
              const isNullSlot = currentVotes === null || currentVotes === 0;

              // Get previous non-null votes for incremental calculation
              let previousVotes = 0;
              if (index > 0) {
                previousVotes = chartData[index - 1].cumulativeVotes || 0;
              }

              const incrementalVotes = isNullSlot
                ? 0
                : currentVotes - previousVotes;
              const displayVotes = currentVotes || 0;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {slot.time}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        +{incrementalVotes}
                      </div>
                      <div className="text-xs text-gray-500">
                        (Total: {displayVotes})
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-700 h-2 rounded-full transition-all"
                      style={{
                        width: `${(displayVotes / booth.totalVoters) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {((displayVotes / booth.totalVoters) * 100).toFixed(1)}%
                    cumulative turnout
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothDetails;
