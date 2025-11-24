import React, { useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function UserMenu({ onClose }) {
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg 
      bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#1f1f23] p-4 z-50 animate-fadeIn"
    >
      {/* Profile Header */}
      <div className="flex items-center gap-3 pb-3 border-b dark:border-[#1f1f23]">
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div>
          <p className="text-sm font-semibold dark:text-white">Admin</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            admin@mail.com
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-3 space-y-2">
        {/* My Profile */}
        <Link
          to="/adminDashboard/profile"
          onClick={onClose}
          className="flex items-center gap-2 p-2 rounded 
          hover:bg-gray-100 dark:hover:bg-[#1f1f23] text-sm dark:text-gray-200"
        >
          <FiUser />
          My Profile
        </Link>

        {/* Language */}
        <button
          className="flex items-center justify-between w-full p-2 rounded 
          hover:bg-gray-100 dark:hover:bg-[#1f1f23] text-sm dark:text-gray-200"
        >
          <span className="flex items-center gap-2">🌐 Language</span>
          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-[#1f1f23] rounded">
            English
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            onClose();
            console.log("Logged out");
          }}
          className="w-full p-2 rounded bg-red-500 text-white text-sm mt-2 
        hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
