import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function InactiveMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("new"); // new | old

  /* -----------------------------
     FETCH INACTIVE USERS (BACKEND)
  ----------------------------- */
  const fetchInactiveMembers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/admin/users?subscription=inactive&sort=${sort}`,
        { withCredentials: true }
      );

      setMembers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch inactive members:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveMembers();
  }, [sort]);

  /* -----------------------------
     HELPERS
  ----------------------------- */
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-[#F2F0EF] dark:bg-[#09090B]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Inactive Members
        </h1>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-gray-200"
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#0D0D0F] rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 p-4">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-500 dark:text-gray-400">
            <FiAlertTriangle className="text-4xl mb-2" />
            No inactive members found
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-[#121214] text-gray-800 dark:text-gray-200 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Member</th>
                <th className="p-3 text-left text-sm font-semibold">Contact</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Created At
                </th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Expired On
                </th>
              </tr>
            </thead>

            <tbody>
              {members.map((user) => (
                <tr
                  key={user._id}
                  onClick={() =>
                    navigate(`/adminDashboard/editMember/${user._id}`)
                  }
                  className="border-b border-gray-200 dark:border-gray-700
                             hover:bg-gray-50 dark:hover:bg-[#1A1A1C]
                             cursor-pointer transition"
                >
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-200">
                    {user.customUserId} — {user.firstName} {user.surName}
                  </td>

                  <td className="p-3 text-gray-900 dark:text-gray-200">
                    {user.contact || user.emailId}
                  </td>

                  <td className="p-3 text-gray-900 dark:text-gray-200">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  </td>

                  <td className="p-3 text-gray-900 dark:text-gray-200">
                    {formatDate(user.endedAt)}
                  </td>
                </tr>
              ))}

              {/* FOOTER */}
              <tr className="bg-gray-100 dark:bg-[#121214] font-semibold">
                <td className="p-3">Total Inactive</td>
                <td className="p-3">{members.length}</td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
