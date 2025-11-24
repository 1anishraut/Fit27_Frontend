import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMoon, FiSun } from "react-icons/fi";
import logo from "../../assets/images.png"

export default function SidebarHeader({ collapsed, onToggle }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // apply theme to <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className="sidebar-header h-16 flex items-center justify-between px-4 
      border-b dark:border-[#1f1f23]
      bg-white dark:bg-[#09090B]"
    >
      {/* Logo + text */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className={`h-8 ${collapsed ? "mx-auto" : "mr-2"}`}
          />
        </div>

        {/* {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none dark:text-white">
              Super Admin
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400 leading-none">
              Management
            </span>
          </div>
        )} */}
      </div>

      {/* Right buttons: theme + collapse */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded 
          hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
        >
          {theme === "dark" ? (
            <FiSun size={18} className="text-yellow-300" />
          ) : (
            <FiMoon size={18} className="text-gray-700" />
          )}
        </button>

        {/* Collapse Button */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 rounded 
          hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
        >
          {collapsed ? (
            <FiChevronRight size={18} className="dark:text-white" />
          ) : (
            <FiChevronLeft size={18} className="dark:text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
