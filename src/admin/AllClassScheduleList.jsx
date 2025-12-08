import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../src/Utils/Constants";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEye, FiChevronDown, FiChevronUp } from "react-icons/fi";

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
  const [open, setOpen] = useState(true);

  /* ============================
      FETCH ALL TEMPLATES
  ============================ */
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/days-template/all`, {
        withCredentials: true,
      });

      setTemplates(res.data.data || []);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /* ============================
      DELETE TEMPLATE
  ============================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;

    try {
      await axios.delete(`${BASE_URL}/days-template/delete/${id}`, {
        withCredentials: true,
      });

      fetchTemplates();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ============================
      GET ONLY DAYS WITH SCHEDULES
  ============================ */
  const getUsedDays = (daysObj) => {
    return DAYS.filter((d) => daysObj[d]?.length > 0);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F10] border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          All Days Templates
        </h2>

        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center gap-1"
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {/* TEMPLATE TABLE */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-200 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3 text-left">Label</th>
                <th className="p-3 text-left">Days</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No templates available
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => {
                  const usedDays = getUsedDays(tpl.days);

                  return (
                    <tr
                      key={tpl._id}
                      className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1A1A1C] transition"
                    >
                      {/* Label */}
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {tpl.label}
                      </td>

                      {/* Days */}
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {usedDays.length > 0 ? usedDays.join(", ") : "—"}
                      </td>

                      {/* Active */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tpl.active
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {tpl.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex justify-end gap-3">
                        <button
                          onClick={() =>
                            navigate(
                              `/adminDashboard/view-days-template/${tpl._id}`
                            )
                          }
                          className="text-blue-500 flex items-center gap-1 hover:underline"
                        >
                          <FiEye /> View
                        </button>

                        <button
                          onClick={() => handleDelete(tpl._id)}
                          className="text-red-500 flex items-center gap-1 hover:underline"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
