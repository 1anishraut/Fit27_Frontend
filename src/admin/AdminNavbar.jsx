import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiFillDashboard } from "react-icons/ai";
import { GiGymBag } from "react-icons/gi";
import { NavLink } from "react-router-dom";

const AdminNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`relative bg-white text-black flex flex-col justify-between transition-all duration-300
        ${isExpanded ? "w-[180px] lg:w-[220px]" : "w-[70px]"}`}
    >
      {/* ---- Nav Links ---- */}
      <nav className="flex flex-col gap-2 mt-20 px-2">
        {/* Dashboard */}
        <NavLink
          to="allDetails"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded transition-all duration-300 
            ${isActive ? "bg-[#AEC0D0]" : "hover:bg-gray-200"}`
          }
        >
          <div className="w-6 flex-shrink-0 flex justify-center">
            <AiFillDashboard size={18} />
          </div>

          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold text-sm
              ${
                isExpanded
                  ? "opacity-100 w-auto ml-1"
                  : "opacity-0 w-0 ml-0 pointer-events-none"
              }`}
          >
            Dashboard
          </span>
        </NavLink>

        {/* Plans */}
        <NavLink
          to="plans"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded transition-all duration-300 
            ${isActive ? "bg-[#AEC0D0]" : "hover:bg-gray-200"}`
          }
          title={!isExpanded ? "Plans" : undefined}
        >
          <div className="w-6 flex-shrink-0 flex justify-center">
            <GiGymBag size={18} />
          </div>

          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold text-sm
              ${
                isExpanded
                  ? "opacity-100 w-auto ml-1"
                  : "opacity-0 w-0 ml-0 pointer-events-none"
              }`}
          >
            Plans
          </span>
        </NavLink>

        {/* Feedbacks */}
        <NavLink
          to="feedbacks"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded transition-all duration-300 
            ${isActive ? "bg-[#AEC0D0]" : "hover:bg-gray-200"}`
          }
          title={!isExpanded ? "Feedbacks" : undefined}
        >
          <div className="w-6 flex-shrink-0 flex justify-center">
            <FaCommentDots size={18} />
          </div>

          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold text-sm
              ${
                isExpanded
                  ? "opacity-100 w-auto ml-1"
                  : "opacity-0 w-0 ml-0 pointer-events-none"
              }`}
          >
            Feedbacks
          </span>
        </NavLink>
      </nav>

      {/* ---- Bottom Settings ---- */}
      <div className="flex items-center gap-1 p-4 border-t border-gray-300">
        <div className="w-6 flex-shrink-0 flex justify-center">
          <IoSettingsOutline size={18} />
        </div>

        <span
          className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold text-sm
            ${
              isExpanded
                ? "opacity-100 w-auto ml-1"
                : "opacity-0 w-0 ml-0 pointer-events-none"
            }`}
        >
          Settings
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        className="absolute left-2 top-4 z-60 bg-white shadow-md w-8 h-8 cursor-pointer flex items-center justify-center rounded-full text-xl text-blue-700 hover:bg-gray-100 transition"
      >
        ☰
      </button>
    </div>
  );
};

export default AdminNavbar;
