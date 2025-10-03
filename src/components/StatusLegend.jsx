import React from "react";

const StatusLegend = () => {
  return (
    <div className="flex justify-center mb-6 space-x-6">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-emerald-500 rounded"></div>
        <span className="text-sm font-medium text-gray-700">Data Received</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-amber-400 rounded"></div>
        <span className="text-sm font-medium text-gray-700">Awaiting Data</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-red-500 rounded animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">
          Overdue (15+ min)
        </span>
      </div>
    </div>
  );
};

export default StatusLegend;
