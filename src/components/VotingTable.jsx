import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingTable = ({
  boothData,
  timeSlots,
  timeLabels,
  getCellStatus,
  getStatusColor,
  onEditBooth,
  onBoothDataUpdate,
  user,
  disablePagination = false,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [showCellEditModal, setShowCellEditModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellEditValue, setCellEditValue] = useState("");
  const boothsPerPage = 15;

  // Calculate pagination
  const indexOfLastBooth = currentPage * boothsPerPage;
  const indexOfFirstBooth = indexOfLastBooth - boothsPerPage;
  const currentBooths = disablePagination
    ? boothData
    : boothData.slice(indexOfFirstBooth, indexOfLastBooth);
  const totalPages = Math.ceil(boothData.length / boothsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactClick = (booth) => {
    setSelectedBooth(booth);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedBooth(null);
  };

  // Mock contact data generator based on booth ID
  const getBoothContact = (booth) => {
    const phoneNumbers = [
      "06212-234567",
      "06212-234568",
      "06212-234569",
      "06212-234570",
      "06212-234571",
      "06212-234572",
      "06212-234573",
      "06212-234574",
    ];
    const presidingOfficers = [
      "Rajesh Kumar Singh",
      "Priya Sharma",
      "Amit Verma",
      "Sunita Devi",
      "Manoj Kumar",
      "Ritu Gupta",
      "Sanjay Thakur",
      "Kavita Singh",
    ];

    return {
      phone: phoneNumbers[booth.id % phoneNumbers.length],
      mobile: `+91-${7000000000 + booth.id}`,
      presidingOfficer: presidingOfficers[booth.id % presidingOfficers.length],
      // assistantOfficer: `Assistant Officer ${booth.id}`,
      // emergencyContact: "06212-100100",
    };
  };

  const handleCellClick = (booth, timeSlot, currentValue) => {
    // Only allow editing if user is admin
    if (user?.role !== "admin") return;

    setSelectedCell({ booth, timeSlot });
    setCellEditValue(currentValue || "");
    setShowCellEditModal(true);
  };

  const closeCellEditModal = () => {
    setShowCellEditModal(false);
    setSelectedCell(null);
    setCellEditValue("");
  };

  const saveCellEdit = () => {
    if (!selectedCell) return;

    const { booth, timeSlot } = selectedCell;
    const newValue = cellEditValue === "" ? null : parseInt(cellEditValue);

    // Update the booth data in localStorage
    const savedData = JSON.parse(localStorage.getItem("boothData"));
    if (savedData) {
      const updatedData = savedData.map((b) => {
        if (b.id === booth.id) {
          return {
            ...b,
            votes: {
              ...b.votes,
              [timeSlot]: newValue,
            },
          };
        }
        return b;
      });

      // Use the callback to update parent component state
      if (onBoothDataUpdate) {
        onBoothDataUpdate(updatedData);
      }
    }

    closeCellEditModal();
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
      <div className="bg-white shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr>
                <th className="pl-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                  <div className="flex items-center gap-2 ml-2">S/N</div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[400px]">
                  Booth Name
                </th>
                <th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]">
                  Total Voters
                </th>
                {timeLabels.map((label, index) => (
                  <th
                    key={timeSlots[index]}
                    className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]">
                  Total Votes
                </th>
                {user?.role === "admin" && (
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[120px]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentBooths.map((booth, index) => {
                // Check if any cell in this row has red/overdue status
                const hasOverdueCell = timeSlots.some((timeSlot) => {
                  const voteCount = booth.votes[timeSlot];
                  const status = getCellStatus(timeSlot, voteCount);
                  const statusColor = getStatusColor(status);
                  return statusColor === "vote-cell-overdue";
                });

                return (
                  <tr
                    key={booth.id}
                    className={`transition-all duration-200 border-t border-b border-gray-200 ${
                      hasOverdueCell
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {indexOfFirstBooth + index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 w-[400px]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate(`/booth/${booth.id}`)}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left break-words whitespace-normal w-full"
                          >
                            {booth.name}
                          </button>
                          {booth.block && (
                            <div className="text-xs text-gray-500 mt-1">
                              {booth.block}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleContactClick(booth)}
                          className="p-2 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
                          title="Contact Details"
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {booth.totalVoters.toLocaleString()}
                      </span>
                    </td>
                    {timeSlots.map((timeSlot) => {
                      const voteCount = booth.votes[timeSlot];
                      const status = getCellStatus(timeSlot, voteCount);
                      const statusColor = getStatusColor(status);

                      return (
                        <td key={timeSlot} className="px-3 py-2 text-center">
                          <div
                            onClick={() =>
                              handleCellClick(booth, timeSlot, voteCount)
                            }
                            className={`${statusColor} rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center w-16 ${
                              user?.role === "admin"
                                ? "cursor-pointer hover:scale-105 hover:shadow-lg"
                                : ""
                            }`}
                            title={
                              user?.role === "admin" ? "Click to edit" : ""
                            }
                          >
                            {voteCount !== null ? (
                              <span className="text-base font-bold">
                                {voteCount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center">
                      <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {(() => {
                          const allVotes = Object.values(booth.votes).filter(
                            (v) => v !== null
                          );
                          const lastVote =
                            allVotes.length > 0
                              ? allVotes[allVotes.length - 1]
                              : 0;
                          return lastVote.toLocaleString();
                        })()}
                      </span>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => onEditBooth(booth)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!disablePagination && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between px-4">
          <div className="text-sm font-medium text-gray-600">
            Showing{" "}
            <span className="text-gray-900">{indexOfFirstBooth + 1}</span> to{" "}
            <span className="text-gray-900">
              {Math.min(indexOfLastBooth, boothData.length)}
            </span>{" "}
            of <span className="text-gray-900">{boothData.length}</span> booths
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
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
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
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
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedBooth && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Contact Details
                </h3>
                <button
                  onClick={closeContactModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
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
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {selectedBooth.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Booth ID: {selectedBooth.id}
                </p>
              </div>

              {(() => {
                const contact = getBoothContact(selectedBooth);
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700">
                            Landline
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {contact.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(`tel:${contact.phone}`)}
                          className="ml-auto p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700">
                            Mobile
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {contact.mobile}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(`tel:${contact.mobile}`)}
                          className="ml-auto p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p className="text-sm">
                              <span className="font-medium">
                                Presiding Officer:
                              </span>{" "}
                              {contact.presidingOfficer}
                            </p>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p className="text-sm">
                              <span className="font-medium">Assistant:</span>{" "}
                              {contact.assistantOfficer}
                            </p>
                          </div> */}
                          {/* <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L4.064 16.5C3.294 18.333 4.256 20 5.794 20z"
                              />
                            </svg>
                            <p className="text-sm">
                              <span className="font-medium text-red-600">
                                Emergency:
                              </span>{" "}
                              {contact.emergencyContact}
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Cell Edit Modal */}
      {showCellEditModal && selectedCell && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Vote Count
                </h3>
                <button
                  onClick={closeCellEditModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
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
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {selectedCell.booth.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Time Slot:{" "}
                  {timeLabels[timeSlots.indexOf(selectedCell.timeSlot)]}
                </p>
                <p className="text-xs text-gray-500">
                  Booth ID: {selectedCell.booth.id}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vote Count
                </label>
                <input
                  type="number"
                  value={cellEditValue}
                  onChange={(e) => setCellEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vote count"
                  min="0"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to clear the vote count
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeCellEditModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCellEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingTable;
