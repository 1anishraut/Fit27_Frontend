import { Outlet } from "react-router";
import "./SuperAdmin.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./SideBar/Sidebar";
import Header from "./Header/Header";

import { useState } from "react";

const SuperAdminLayout = () => {
  // ⬅ Sidebar state moved here (parent)
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white dark:bg-[#09090B]">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN AREA */}
      <div
        className={`flex flex-col h-full transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* HEADER — controls the sidebar here */}
        <Header onToggleSidebar={() => setCollapsed((prev) => !prev)} />

        {/* MAIN CONTENT */}
        <div className="flex-1 mt-16 overflow-y-auto p-6 dark:bg-[#09090B]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
