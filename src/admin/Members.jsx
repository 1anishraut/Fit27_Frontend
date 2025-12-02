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

  /* ========================================
         CLICK OUTSIDE TO CLOSE MENU
  ======================================== */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  /* ========================================
         FETCH MEMBERS (Correct Route)
  ======================================== */
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/allUsers`, {
        withCredentials: true,
      });

      console.log(res.data);
      
      setMembers(res.data || []);
    } catch (err) {
      console.log("Error fetching members:", err);
    }
  };

  /* ========================================
         TOGGLE STATUS
  ======================================== */
  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      await axios.patch(
        `${BASE_URL}/user/update`,
        {
          emailId: user.emailId,
          status: newStatus,
        },
        { withCredentials: true }
      );

      setMembers((prev) =>
        prev.map((m) => (m._id === user._id ? { ...m, status: newStatus } : m))
      );
    } catch (error) {
      console.log("Status update failed:", error);
    }
  };

  /* ========================================
         DELETE MEMBER
  ======================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`${BASE_URL}/user/delete/${id}`, {
        withCredentials: true,
      });

      setMembers((prev) => prev.filter((m) => m._id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Members Overview
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createMembers")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"
        >
          + Add Member
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="w-full bg-white dark:bg-[#0D0D0F] rounded-xl p-4 shadow-2xl border border-gray-400 dark:border-gray-700">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full border-collapse">
            {/* TABLE HEADER */}
            <thead className="bg-[#121214] text-gray-200">
              <tr>
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Contact</th>
                <th className="p-3 text-left font-medium">Plan Name</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Plan Expiring</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <FiAlertTriangle className="text-4xl mb-2" />
                      No members found
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 bg-[#0D0D0F] hover:bg-[#1A1A1A] transition"
                  >
                    <td className="p-3 text-gray-200">
                      {user.firstName} {user.surName}
                    </td>

                    <td className="p-3 text-gray-200">{user.emailId}</td>

                    <td className="p-3 text-gray-200">{user.contact}</td>

                    <td className="p-3 text-gray-200">{user.selectedPlan}</td>

                    {/* STATUS TOGGLE */}
                    <td className="p-3">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={user.status === "active"}
                            onChange={() => toggleStatus(user)}
                            className="sr-only"
                          />

                          <div
                            className={`w-10 h-5 rounded-full transition ${
                              user.status === "active"
                                ? "bg-green-600"
                                : "bg-gray-600"
                            }`}
                          ></div>

                          <div
                            className={`absolute left-1 top-1 w-3 h-3 rounded-full transition ${
                              user.status === "active"
                                ? "translate-x-5 bg-white"
                                : "translate-x-0 bg-white"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>

                    <td className="p-3 text-gray-200">
                      {formatDate(user.endedAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 relative flex justify-end items-center">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-300"
                        onClick={() => toggleMenu(user._id)}
                      />

                      {menuOpenId === user._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 bg-[#1A1A1C] shadow-xl rounded-lg w-40 border border-gray-700 z-50"
                        >
                          <button
                            onClick={() =>
                              navigate(
                                `/adminDashboard/editMembers/${user._id}`,
                                { state: { user } }
                              )
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-gray-200 hover:bg-[#2A2A2C]"
                          >
                            <FiEdit2 /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-[#2A2A2C]"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}

              {members.length > 0 && (
                <tr className="bg-[#121214] text-gray-200 font-semibold">
                  <td className="p-3">Total Members</td>
                  <td className="p-3">{members.length}</td>
                  <td colSpan={5}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* REMOVE SCROLLBAR */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none !important; }
          .no-scrollbar { scrollbar-width: none !important; }
        `}</style>
      </div>
    </div>
  );
}
