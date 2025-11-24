import React, { useState, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sidebar fixed top-0 left-0 h-screen z-30 flex flex-col 
      bg-white dark:bg-[#09090B] 
      border-r dark:border-[#1f1f23] 
      shadow-lg transition-all duration-200
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
      />

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <SidebarMenu collapsed={collapsed} />
      </div>

      {/* Optional footer */}
      {/* 
      <div className="h-14 border-t dark:border-[#1f1f23]
          flex items-center justify-center text-xs 
          text-gray-500 dark:text-gray-300">
        © 2025 YourApp
      </div>
      */}
    </aside>
  );
}
