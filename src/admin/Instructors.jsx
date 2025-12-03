import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../Utils/Constants";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiAlertTriangle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Instructors() {
  const navigate = useNavigate();

  const [instructors, setInstructors] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const menuRef = useRef(null);

  /* =====================================================
        CLICK OUTSIDE TO CLOSE DROPDOWN MENU
  ===================================================== */
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

  /* =====================================================
        FETCH INSTRUCTORS
  ===================================================== */
  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/instructors/all`, {
        withCredentials: true,
      });

      setInstructors(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  /* =====================================================
        DELETE INSTRUCTOR
  ===================================================== */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/instructors/delete/${id}`, {
        withCredentials: true,
      });

      setInstructors((prev) => prev.filter((item) => item._id !== id));
      setMenuOpenId(null);
    } catch (error) {
      console.log(error);
    }
  };

  /* =====================================================
        ACTIVE / INACTIVE TOGGLE
  ===================================================== */
  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/instructors/update/${id}`,
        { active: !currentStatus },
        { withCredentials: true }
      );

      setInstructors((prev) =>
        prev.map((ins) =>
          ins._id === id ? { ...ins, active: !currentStatus } : ins
        )
      );
    } catch (error) {
      console.log("Active toggle failed:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Instructors Overview
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createInstructors")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"
        >
          + Add Instructor
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="w-full bg-white dark:bg-[#0D0D0F] rounded-xl p-4 shadow-2xl border border-gray-400 dark:border-gray-700">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full border-collapse">
            <thead className="bg-[#121214] text-gray-200">
              <tr>
                <th className="p-3 text-left font-medium">Instructor Name</th>
                <th className="p-3 text-left font-medium">Expertise</th>
                <th className="p-3 text-left font-medium">Contact</th>
                <th className="p-3 text-left font-medium">Active</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {instructors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <FiAlertTriangle className="text-4xl mb-2" />
                      No instructors available
                    </div>
                  </td>
                </tr>
              ) : (
                instructors.map((item) => (
                  <tr
                    key={item._id}
                    className="
                      border-b border-gray-700
                      bg-[#0D0D0F]
                      hover:bg-[#1A1A1A]
                      transition
                    "
                  >
                    <td className="p-3 text-gray-200">{item.name}</td>
                    <td className="p-3 text-gray-200">{item.expertise}</td>
                    <td className="p-3 text-gray-200">{item.phone}</td>

                    {/* ACTIVE TOGGLE */}
                    <td className="p-3">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={item.active}
                            onChange={() => toggleActive(item._id, item.active)}
                            className="sr-only"
                          />

                          <div
                            className={`w-10 h-5 rounded-full transition ${
                              item.active ? "bg-green-600" : "bg-gray-600"
                            }`}
                          ></div>

                          <div
                            className={`absolute left-1 top-1 w-3 h-3 rounded-full transition ${
                              item.active
                                ? "translate-x-5 bg-white"
                                : "translate-x-0 bg-white"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="p-3 relative flex justify-end items-center">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-300"
                        onClick={() => toggleMenu(item._id)}
                      />

                      {menuOpenId === item._id && (
                        <div
                          ref={menuRef}
                          className="
                            absolute right-0 top-10
                            bg-[#1A1A1C]
                            shadow-xl rounded-lg w-40
                            border border-gray-700
                            z-50
                          "
                        >
                          {/* EDIT */}
                          <button
                            onClick={() =>
                              navigate(
                                `/adminDashboard/editInstructors/${item._id}`,
                                { state: { item } }
                              )
                            }
                            className="
                              flex items-center gap-2 w-full px-4 py-2
                              text-gray-200 hover:bg-[#2A2A2C]
                            "
                          >
                            <FiEdit2 />
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="
                              flex items-center gap-2 w-full px-4 py-2
                              text-red-400 hover:bg-[#2A2A2C]
                            "
                          >
                            <FiTrash2 />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}

              {instructors.length > 0 && (
                <tr className="bg-[#121214] text-gray-200 font-semibold">
                  <td className="p-3">Total Instructors</td>
                  <td className="p-3">{instructors.length}</td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCROLLBAR REMOVAL */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { scrollbar-width: none !important; }
      `}</style>
    </div>
  );
}
