// src/admin/Members.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Members() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const menuRef = useRef(null);

  /* -----------------------------
        CLOSE DROPDOWN WHEN CLICK OUTSIDE
  ----------------------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -----------------------------
      FETCH MEMBERS (ACCORDING TO BACKEND)
  ----------------------------- */
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/allUsers`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      

      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setMembers(list);
    } catch (error) {
      console.error("Fetch members error:", error);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* -----------------------------
      DELETE MEMBER
  ----------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      await axios.delete(`${BASE_URL}/user/delete/${id}`, {
        withCredentials: true,
      });

      setMembers((prev) => prev.filter((m) => m._id !== id));
      setMenuOpenId(null);
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  /* -----------------------------
      HELPERS
  ----------------------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";

    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanName = (user) => {
    if (!user.selectedPlan) return "N/A";

    return typeof user.selectedPlan === "object"
      ? user.selectedPlan.planName
      : user.selectedPlan;
  };

  return (
    <div className="p-6 min-h-screen bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Members Overview
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createMember")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"
        >
          + Add Member
        </button>
      </div>

      {/* TABLE */}
      <div className="w-full bg-white dark:bg-[#0D0D0F] rounded-xl p-4 shadow-xl border border-gray-400 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-[#121214] text-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Member Status</th>
              <th className="p-3 text-left">Subscription</th>
              <th className="p-3 text-left">Expiring On</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                    <FiAlertTriangle className="text-4xl mb-2" />
                    No members found
                  </div>
                </td>
              </tr>
            ) : (
              members.map((user) => {
                // ⭐ STATUS BADGE COLOR LOGIC
                const statusColor =
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : user.status === "hold"
                    ? "bg-yellow-100 text-yellow-800"
                    : user.status === "pending"
                    ? "bg-blue-100 text-blue-800"
                    : user.status === "lost"
                    ? "bg-gray-300 text-gray-800"
                    : "bg-red-100 text-red-800"; 

                return (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D0D0F] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {user.firstName} {user.surName}
                    </td>

                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {user.emailId}
                    </td>

                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {user.contact}
                    </td>

                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {getPlanName(user)}
                    </td>

                    {/* ⭐ NEW MEMBER STATUS BADGE */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor}`}
                      >
                        {user.status?.charAt(0).toUpperCase() +
                          user.status?.slice(1)}
                      </span>
                    </td>

                    {/* Subscription Badge */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.subscription === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.subscription === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {formatDate(user.endedAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 relative text-right">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-600 dark:text-gray-300"
                        onClick={() =>
                          setMenuOpenId((prev) =>
                            prev === user._id ? null : user._id
                          )
                        }
                      />

                      {menuOpenId === user._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 bg-white dark:bg-[#1A1A1C] shadow-xl rounded-lg w-40 border border-gray-300 dark:border-gray-700 z-50"
                        >
                          <button
                            onClick={() =>
                              navigate(`/adminDashboard/editMember/${user._id}`)
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2C]"
                          >
                            <FiEdit2 /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-[#2A2A2C]"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}

            {members.length > 0 && (
              <tr className="bg-[#121214] text-gray-200 font-semibold">
                <td className="p-3">Total Members</td>
                <td className="p-3">{members.length}</td>
                <td colSpan={6}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
