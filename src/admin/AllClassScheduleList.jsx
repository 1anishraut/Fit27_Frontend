// src/admin/ClassSchedule/DaysTemplateList.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../src/Utils/Constants";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash2, FiEdit2, FiEye, FiAlertTriangle } from "react-icons/fi";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DaysTemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  // Action menu
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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

  /* ===============================
        FETCH TEMPLATES
  =============================== */
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/days-template/all`, {
        withCredentials: true,
      });

      setTemplates(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /* ===============================
        ACTIVE TOGGLE UPDATE
  =============================== */
  const toggleActive = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/days-template/update/${id}`,
        { active: !currentStatus },
        { withCredentials: true }
      );

      // Update UI instantly
      setTemplates((prev) =>
        prev.map((tpl) =>
          tpl._id === id ? { ...tpl, active: !currentStatus } : tpl
        )
      );
    } catch (error) {
      console.error("Active toggle failed:", error);
      alert("Failed to update active status.");
    }
  };

  /* ===============================
        DELETE TEMPLATE
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;

    try {
      await axios.delete(`${BASE_URL}/days-template/delete/${id}`, {
        withCredentials: true,
      });

      fetchTemplates();
      setMenuOpenId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ===============================
        USED DAY LIST
  =============================== */
  const getUsedDays = (daysObj) => {
    return DAYS.filter((d) => daysObj[d]?.length > 0);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-[#09090B] transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Days Template List
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createDaysSchedule")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"
        >
          + Create New Schedule
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="w-full bg-white dark:bg-[#111118] rounded-xl p-4 shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full border-collapse">
            {/* HEADER */}
            <thead>
              <tr className="bg-gray-200 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-medium">Label</th>
                <th className="p-3 text-left font-medium">Days</th>
                <th className="p-3 text-left font-medium">Active</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* EMPTY STATE */}
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <FiAlertTriangle className="text-4xl mb-2" />
                      No templates available
                    </div>
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => {
                  const usedDays = getUsedDays(tpl.days);

                  return (
                    <tr
                      key={tpl._id}
                      className="
                        border-b border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-[#121214] 
                        hover:bg-gray-50 dark:hover:bg-[#1D1D20]
                        transition
                      "
                    >
                      {/* LABEL */}
                      <td className="p-3 text-gray-900 dark:text-gray-200">
                        {tpl.label}
                      </td>

                      {/* DAYS */}
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {usedDays.length > 0 ? usedDays.join(", ") : "—"}
                      </td>

                      {/* ACTIVE TOGGLE */}
                      <td className="p-3">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={tpl.active}
                            onChange={() => toggleActive(tpl._id, tpl.active)}
                            className="sr-only"
                          />

                          {/* Background */}
                          <div
                            className={`w-10 h-5 rounded-full transition ${
                              tpl.active ? "bg-green-600" : "bg-gray-500"
                            }`}
                          ></div>

                          {/* Knob */}
                          <div
                            className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition ${
                              tpl.active ? "translate-x-5" : "translate-x-0"
                            }`}
                          ></div>
                        </label>
                      </td>

                      {/* ACTION MENU */}
                      <td className="p-3 relative flex justify-end">
                        <BsThreeDotsVertical
                          className="text-xl cursor-pointer text-gray-600 dark:text-gray-300"
                          onClick={() => toggleMenu(tpl._id)}
                        />

                        {menuOpenId === tpl._id && (
                          <div
                            ref={menuRef}
                            className="
                              absolute right-0 top-10 z-50
                              bg-white dark:bg-[#1A1A1C]
                              border border-gray-300 dark:border-gray-700
                              shadow-xl rounded-lg w-40
                            "
                          >
                            {/* VIEW */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/adminDashboard/view-days-template/${tpl._id}`
                                )
                              }
                              className="
                                flex items-center gap-2 w-full px-4 py-2
                                text-gray-700 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-[#2A2A2C]
                              "
                            >
                              <FiEye /> View
                            </button>

                            {/* EDIT */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/adminDashboard/edit-days-template/${tpl._id}`,
                                  { state: { tpl } }
                                )
                              }
                              className="
                                flex items-center gap-2 w-full px-4 py-2
                                text-gray-700 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-[#2A2A2C]
                              "
                            >
                              <FiEdit2 /> Edit
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => handleDelete(tpl._id)}
                              className="
                                flex items-center gap-2 w-full px-4 py-2
                                text-red-600 dark:text-red-400 
                                hover:bg-gray-100 dark:hover:bg-[#2A2A2C]
                              "
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
            </tbody>
          </table>
        </div>
      </div>

      {/* SCROLLBAR FIX */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { scrollbar-width: none !important; }
      `}</style>
    </div>
  );
}
