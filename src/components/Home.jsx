import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="8" fill="#FF6B35"/>
                <path d="M24 12L32 20H28V32H20V20H16L24 12Z" fill="white"/>
              </svg>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BIHAR ELECTIONS</h1>
                <p className="text-sm text-gray-600">Serving Citizens of Bihar</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>English</option>
              <option>हिंदी</option>
            </select>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Track Your <span className="text-orange-500">Voting Status</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your voting booth status in real time.<br/>
            View live updates and comprehensive analytics.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Enter Your Booth ID</h2>
            <p className="text-gray-600 text-lg">Track your booth status instantly</p>
          </div>

          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="e.g., BOOTH001, MFR-45"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <Link
              to="/dashboard"
              className="px-10 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Track Now
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">50+</div>
              <div className="text-sm text-gray-600">Polling Booths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">6</div>
              <div className="text-sm text-gray-600">Time Slots</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">Live</div>
              <div className="text-sm text-gray-600">Real-time Updates</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">
              Live vote tracking with automatic refresh. Stay updated instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Data</h3>
            <p className="text-gray-600">
              Detailed booth-wise statistics with time-slot based counting.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent System</h3>
            <p className="text-gray-600">
              Color-coded indicators for complete transparency and monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">
            Bihar State Election Commission | बिहार राज्य निर्वाचन आयोग
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2025 Bihar Elections Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Real-Time Updates
            </h3>
            <p className="text-gray-600">
              Live vote tracking with automatic refresh every 2 hours. Stay
              updated with the latest voting data instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-orange-600"
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Comprehensive Analytics
            </h3>
            <p className="text-gray-600">
              Detailed booth-wise statistics with time-slot based vote counting
              and turnout tracking.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Transparent Monitoring
            </h3>
            <p className="text-gray-600">
              Color-coded status indicators for data reception, delays, and
              overdue reports for complete transparency.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm p-12 mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Muzzafarpur Vidhan Sabha Constituency
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Polling Booths</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-600 font-medium">Time Slots</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">2hr</div>
              <div className="text-gray-600 font-medium">Auto Refresh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-sm">
            Bihar State Election Commission | भारत निर्वाचन आयोग
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2025 Bihar Elections Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
