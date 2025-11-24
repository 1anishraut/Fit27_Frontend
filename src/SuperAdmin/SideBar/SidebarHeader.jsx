import React from "react";
import { FiChevronLeft, FiChevronRight, FiMoon, FiSun } from "react-icons/fi";
import logo from "../../assets/images.png";

export default function SidebarHeader({
  collapsed,
  onToggle,
  theme,
  setTheme,
}) {
  return (
    <div
      className="sidebar-header h-16 flex items-center justify-between px-4 
      border-b dark:border-[#1f1f23]
      bg-white dark:bg-[#09090B]"
    >
      

      <div className="flex items-center gap-2">
      

        
      </div>
    </div>
  );
}
