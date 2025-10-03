import React from "react";

const VotingTable = ({
  boothData,
  timeSlots,
  timeLabels,
  getCellStatus,
  getStatusColor,
}) => {
  return (
    <div className="bg-white rounded- shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S/N
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booth Name ↗
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Total Voters
              </th>
              {timeLabels.map((label, index) => (
                <th
                  key={timeSlots[index]}
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  {label}
                </th>
              ))}
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Total Votes Cast
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {boothData.map((booth, index) => (
              <tr key={booth.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py- whitespace-nowrap text-sm text-gray-900">
                  {index + 1}.
                </td>
                <td className="px-6 py- whitespace-nowrap text-sm font-medium text-gray-900">
                  {booth.name}
                </td>
                <td className="px-6 py- text-center whitespace-nowrap">
                  <div className="bg-blue-100 rounded- px-3 py-2 text-sm font-semibold inline-block min-w-[80px]">
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
                      className="px-6 text-center whitespace-nowrap"
                    >
                      <div
                        className={`${statusColor} rounded- px-3 py-2 text-sm font-semibold transition-all duration-300 inline-block min-w-[80px]`}
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
                <td className="px-6 text-center whitespace-nowrap">
                  <div className="bg-purple-100 rounded- px-3 py-2 text-sm font-semibold inline-block min-w-[80px]">
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
  );
};

export default VotingTable;
