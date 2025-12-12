import React from "react";
import { FiX } from "react-icons/fi";
import SidebarMenu from "./SidebarMenu";

export default function MobileSidebar({ onClose }) {
  return (
    <div
      className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#09090B] 
      shadow-xl border-r border-gray-200 dark:border-[#1f1f23] overflow-y-auto"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-16 border-b 
        border-gray-200 dark:border-[#1f1f23]"
      >
        <span className="text-sm font-semibold dark:text-white">Menu</span>

        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
        >
          <FiX className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Menu */}
      <div className="px-2 py-4">
        <SidebarMenu isMobile={true} onClose={onClose} collapsed={false} />
      </div>
    </div>
  );
}
