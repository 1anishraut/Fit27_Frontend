import React, { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function GymPlanTable({ data = [] }) {
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  /* ----------------------------------------------------------
      Apply sorting whenever input data or sort order changes
  ---------------------------------------------------------- */
  useEffect(() => {
    let temp = [...data];

    if (sortOrder === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortOrder === "oldest") {
      temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortOrder === "active-first") {
      temp.sort((a, b) => Number(b.active) - Number(a.active));
    }

    if (sortOrder === "inactive-first") {
      temp.sort((a, b) => Number(a.active) - Number(b.active));
    }

    if (sortOrder === "expiry-soon") {
      temp.sort(
        (a, b) => new Date(a.planEndDate || 0) - new Date(b.planEndDate || 0)
      );
    }

    setSortedData(temp);
  }, [sortOrder, data]);

  return (
    <div className="w-full mt-10 bg-white dark:bg-[#0D0D0F] rounded-xl p-4 shadow-2xl mb-6 border border-gray-400 dark:border-gray-700">
      {/* ================= SORT BAR ================= */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Gym Plan Overview
        </h2>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 rounded-lg border 
            border-gray-300 dark:border-gray-700 
            bg-white dark:bg-[#1f1f23] 
            text-gray-700 dark:text-gray-200"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="active-first">Active First</option>
          <option value="inactive-first">Inactive First</option>
          <option value="expiry-soon">Expiring Soon</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-[#1f1f23] text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left font-medium">GYM Name</th>
              <th className="p-3 text-left font-medium">Plan</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Start Date</th>
              <th className="p-3 text-left font-medium">End Date</th>
              <th className="p-3 text-left font-medium">Expiry In</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                    <FiAlertTriangle className="text-4xl mb-2" />
                    No data available
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a1a1d] transition"
                >
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.gymName}
                  </td>

                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.plan?.name || "No Plan"}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-md font-medium ${
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* START DATE */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.planStartDate
                      ? new Date(item.planStartDate).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* END DATE */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.planEndDate
                      ? new Date(item.planEndDate).toLocaleDateString()
                      : "Lifetime"}
                  </td>

                  {/* EXPIRY IN */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.planEndDate
                      ? calculateExpiry(item.planEndDate)
                      : "Lifetime"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===========================================================
   Helper: Calculate "Expiry in X Days"
=========================================================== */
function calculateExpiry(endDate) {
  const today = new Date();
  const expiry = new Date(endDate);

  const diffTime = expiry - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "Expired";
  if (daysLeft === 0) return "Expires Today";

  return `${daysLeft} days`;
}
