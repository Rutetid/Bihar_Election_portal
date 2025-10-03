import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingTable = ({
  boothData,
  timeSlots,
  timeLabels,
  getCellStatus,
  getStatusColor,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const boothsPerPage = 15;

  // Calculate pagination
  const indexOfLastBooth = currentPage * boothsPerPage;
  const indexOfFirstBooth = indexOfLastBooth - boothsPerPage;
  const currentBooths = boothData.slice(indexOfFirstBooth, indexOfLastBooth);
  const totalPages = Math.ceil(boothData.length / boothsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div>
      <div className="bg-white rounded- shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  S/N
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                  Booth Name ↗
                </th>
                <th className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Total Voters
                </th>
                {timeLabels.map((label, index) => (
                  <th
                    key={timeSlots[index]}
                    className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Total Votes Cast
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBooths.map((booth, index) => (
                <tr
                  key={booth.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indexOfFirstBooth + index + 1}.
                  </td>
                  <td className="px-6 py-4 text-sm font-medium max-w-md">
                    <button
                      onClick={() => navigate(`/booth/${booth.id}`)}
                      className="text-blue-700 hover:text-blue-800 hover:underline text-left break-words transition-colors"
                    >
                      {booth.name}
                    </button>
                  </td>
                  <td className="px-2 py-4 text-center whitespace-nowrap">
                    <div className="bg-blue-100 rounded-md px-2 py-2 text-sm font-semibold inline-block min-w-[80px]">
                      <div className="text-base font-bold text-blue-900">
                        {booth.totalVoters.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </td>
                  {timeSlots.map((timeSlot) => {
                    const voteCount = booth.votes[timeSlot];
                    const status = getCellStatus(timeSlot, voteCount);
                    const statusColor = getStatusColor(status);

                    return (
                      <td
                        key={timeSlot}
                        className="px-2 py-4 text-center whitespace-nowrap"
                      >
                        <div
                          className={`${statusColor} rounded-md px-2 py-2 text-sm font-semibold transition-all duration-300 inline-block min-w-[80px]`}
                        >
                          {voteCount !== null ? (
                            <div>
                              <div className="text-base font-bold">
                                {voteCount.toLocaleString("en-IN")}
                              </div>
                            </div>
                          ) : (
                            <div className="text-base">—</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-4 text-center whitespace-nowrap">
                    <div className="bg-purple-100 rounded-md px-2 py-2 text-sm font-semibold inline-block min-w-[80px]">
                      <div className="text-base font-bold text-purple-900">
                        {(() => {
                          const allVotes = Object.values(booth.votes).filter(
                            (v) => v !== null
                          );
                          const lastVote =
                            allVotes.length > 0
                              ? allVotes[allVotes.length - 1]
                              : 0;
                          return lastVote.toLocaleString("en-IN");
                        })()}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between px-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstBooth + 1} to{" "}
            {Math.min(indexOfLastBooth, boothData.length)} of {boothData.length}{" "}
            booths
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-700 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingTable;
