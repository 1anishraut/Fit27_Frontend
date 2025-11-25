import { Outlet } from "react-router";
import "./SuperAdmin.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./SideBar/Sidebar";
import Header from "./Header/Header";

import { useState, useEffect } from "react";

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F2F0EF] dark:bg-[#09090B]">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* SIDEBAR (hidden on mobile) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        theme={theme}
        setTheme={setTheme}
      />

      {/* MAIN */}
      <div
        className={`flex flex-col h-full transition-all duration-300 
        ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {/* HEADER */}
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme}
          setTheme={setTheme}
        />

        {/* PAGE CONTENT */}
        <div className="flex-1 mt-16 overflow-y-auto p-6 dark:bg-[#09090B]">
          <Outlet context={{ theme, setTheme }} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
