import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../Utils/Constants";
import { addClasses } from "../Utils/classesSlice";
import { useDispatch } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiAlertTriangle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Classes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const menuRef = useRef(null);

  /* ============================
      CLOSE DROPDOWN ON OUTSIDE 
  ==============================*/
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

  /* ============================
        FETCH CLASSES
  ==============================*/
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes/all`, {
        withCredentials: true,
      });

      const list = res?.data?.data || [];
      setClasses(list);
      dispatch(addClasses(list));
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  /* ============================
        DELETE CLASS
  ==============================*/
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/classes/delete/${id}`, {
        withCredentials: true,
      });

      setClasses((prev) => prev.filter((item) => item._id !== id));
      setMenuOpenId(null);
    } catch (error) {
      console.log(error);
    }
  };

  /* ============================
      ACTIVE TOGGLE UPDATE
  ==============================*/
  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/classes/update/${id}`,
        { active: !currentStatus },
        { withCredentials: true }
      );

      setClasses((prev) =>
        prev.map((cls) =>
          cls._id === id ? { ...cls, active: !currentStatus } : cls
        )
      );
    } catch (error) {
      console.log("Active toggle update failed:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-[#09090B] transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Classes Overview
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createClasses")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"
        >
          + Add Class
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="w-full bg-white dark:bg-[#111118] rounded-xl p-4 shadow-lg border border-gray-300 dark:border-gray-700">
        {/* TABLE WRAPPER */}
        <div className="overflow-visible no-scrollbar">
          <table className="w-full border-collapse">
            {/* HEADER */}
            <thead>
              <tr className="bg-gray-200 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-medium">Class Name</th>
                <th className="p-3 text-left font-medium">Capacity</th>
                <th className="p-3 text-left font-medium">Remaining</th>
                <th className="p-3 text-left font-medium">Cost</th>
                <th className="p-3 text-left font-medium">Active</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* EMPTY STATE */}
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <FiAlertTriangle className="text-4xl mb-2" />
                      No classes available
                    </div>
                  </td>
                </tr>
              ) : (
                classes.map((item) => (
                  <tr
                    key={item._id}
                    className="
                      border-b border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-[#121214]
                      hover:bg-gray-50 dark:hover:bg-[#1D1D20]
                      transition
                    "
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {item.capacity}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {item.remainingCapacity || item.capacity}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      ₹{item.cost}
                    </td>

                    {/* ACTIVE TOGGLE */}
                    <td className="p-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => toggleActive(item._id, item.active)}
                          className="sr-only"
                        />

                        <div
                          className={`w-10 h-5 rounded-full transition ${
                            item.active ? "bg-green-600" : "bg-gray-400"
                          }`}
                        />

                        <div
                          className={`absolute ml-1 w-3 h-3 rounded-full bg-white transition ${
                            item.active ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </label>
                    </td>

                    {/* ACTION MENU */}
                    <td className="p-3 relative flex justify-end">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-600 dark:text-gray-300"
                        onClick={() => toggleMenu(item._id)}
                      />

                      {menuOpenId === item._id && (
                        <div
                          ref={menuRef}
                          className="
                            absolute right-0 top-10 z-50
                            bg-white dark:bg-[#1A1A1C]
                            border border-gray-300 dark:border-gray-700
                            shadow-xl rounded-lg w-40
                          "
                        >
                          {/* EDIT */}
                          <button
                            onClick={() =>
                              navigate(
                                `/adminDashboard/editClasses/${item._id}`,
                                { state: { item } }
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
                            onClick={() => handleDelete(item._id)}
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
                ))
              )}

              {/* FOOTER ROW */}
              {classes.length > 0 && (
                <tr className="bg-gray-200 dark:bg-[#1A1A1C] text-gray-800 dark:text-gray-200 font-semibold">
                  <td className="p-3">Total Classes</td>
                  <td className="p-3">{classes.length}</td>
                  <td colSpan={4}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NO SCROLLBAR */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { scrollbar-width: none !important; }
      `}</style>
    </div>
  );
}
