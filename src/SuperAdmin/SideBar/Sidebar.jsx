import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`sidebar fixed top-0 left-0 h-screen z-50 flex flex-col pt-16 
      bg-white dark:bg-[#09090B] 
      border-r dark:border-[#1f1f23] 
      shadow-lg transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
      />

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <SidebarMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
