import React from "react";
import SidebarMenu from "./SidebarMenu";

export default function Sidebar({ collapsed, setCollapsed, theme, setTheme }) {
  return (
    <aside
      className={`hidden lg:flex fixed top-0 left-0 h-screen z-50 flex-col pt-16 
      bg-[#F2F0EF] dark:bg-[#09090B] border-r border-gray-300 dark:border-[#1f1f23] 
      shadow-lg transition-all 
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <SidebarMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
