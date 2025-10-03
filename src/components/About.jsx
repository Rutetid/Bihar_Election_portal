import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          About Bihar Elections Dashboard
        </h1>

        <div className="space-y-4 text-gray-600">
          <p className="text-lg">
            Welcome to the Bihar Elections Dashboard 2025. This real-time
            monitoring system tracks voting data across all polling booths in
            the Muzzafarpur Vidhan Sabha Constituency.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
            Features
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Real-time vote tracking with 2-hour auto-refresh</li>
            <li>Color-coded status indicators for data reception</li>
            <li>Comprehensive booth-wise voting statistics</li>
            <li>Time-slot based vote counting</li>
            <li>Total voters and votes cast tracking</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
            Status Indicators
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-semibold text-emerald-600">Green</span> -
              Data received successfully
            </li>
            <li>
              <span className="font-semibold text-amber-600">Yellow</span> -
              Awaiting data (within 15 minutes)
            </li>
            <li>
              <span className="font-semibold text-red-600">Red</span> - Overdue
              (15+ minutes late)
            </li>
            <li>
              <span className="font-semibold text-gray-600">Gray</span> - Future
              time slot
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
