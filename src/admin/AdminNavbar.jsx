import React, { useState, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiFillDashboard } from "react-icons/ai";
import { GiGymBag } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { RxTrackNext } from "react-icons/rx";
import { FaBook } from "react-icons/fa";

const AdminNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme class to <html>
  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  return (
    <div className="relative flex flex-col justify-between ">
      <div
        className="absolute top-18 right-[-12px] bg-white dark:bg-[#09090B]
          w-6 h-6 rounded-md border border-gray-600 flex items-center justify-center shadow-md
          text-black dark:text-white  dark:hover:bg-[#323236] transition z-50"
      >
        <RxTrackNext size={12} color="gray" />
      </div>
      <div
        className={`relative flex flex-col justify-between transition-all duration-200 h-full border-r border-gray-600 pr-5
        bg-white text-black 
        dark:bg-[#09090B] dark:text-gray-100
        ${isExpanded ? "w-[180px] lg:w-[220px]" : "w-[70px]"}
      `}
      >
        {/* ---- Nav Links ---- */}
        <nav className="flex flex-col gap-2 mt-20 px-2">
          <NavLink
            to="allDetails"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition-all duration-300
            ${
              isActive
                ? "bg-[#AEC0D0] dark:bg-[#1A1A1C]"
                : "hover:bg-gray-200 dark:hover:bg-[#1A1A1C]"
            }`
            }
          >
            <div className="w-6 flex-shrink-0 flex justify-center">
              <AiFillDashboard size={18} />
            </div>
            <span
              className={`font-semibold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap
              ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 pointer-events-none"
              }
            `}
            >
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="plans"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition-all duration-300
            ${
              isActive
                ? "bg-[#AEC0D0] dark:bg-[#1A1A1C]"
                : "hover:bg-gray-200 dark:hover:bg-[#1A1A1C]"
            }`
            }
          >
            <div className="w-6 flex-shrink-0 flex justify-center">
              <GiGymBag size={18} />
            </div>
            <span
              className={`font-semibold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap
              ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 pointer-events-none"
              }
            `}
            >
              Plans
            </span>
          </NavLink>
          <NavLink
            to="classes"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition-all duration-300
            ${
              isActive
                ? "bg-[#AEC0D0] dark:bg-[#1A1A1C]"
                : "hover:bg-gray-200 dark:hover:bg-[#1A1A1C]"
            }`
            }
          >
            <div className="w-6 flex-shrink-0 flex justify-center">
              <FaBook size={18} />
            </div>
            <span
              className={`font-semibold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap
              ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 pointer-events-none"
              }
            `}
            >
              Classes
            </span>
          </NavLink>

          <NavLink
            to="feedbacks"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition-all duration-300
            ${
              isActive
                ? "bg-[#AEC0D0] dark:bg-[#1A1A1C]"
                : "hover:bg-gray-200 dark:hover:bg-[#1A1A1C]"
            }`
            }
          >
            <div className="w-6 flex-shrink-0 flex justify-center">
              <FaCommentDots size={18} />
            </div>
            <span
              className={`font-semibold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap
              ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 pointer-events-none"
              }
            `}
            >
              Feedbacks
            </span>
          </NavLink>
        </nav>

        {/* ---- Bottom Theme + Settings ---- */}
        <div className="p-4 border-t border-gray-300 dark:border-[#1A1A1C]">
          <div className="flex items-center gap-2">
            <div className="w-6 flex justify-center">
              <IoSettingsOutline size={18} />
            </div>
            <span
              className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap
              ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 pointer-events-none"
              }
            `}
            >
              Settings
            </span>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute z-50 left-2 top-4 bg-white dark:bg-[#1A1A1C] shadow-md w-8 h-8
        cursor-pointer flex items-center justify-center rounded-full text-xl
        text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2F] transition"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
