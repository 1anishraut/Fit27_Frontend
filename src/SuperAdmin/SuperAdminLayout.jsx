import { Outlet, useNavigate } from "react-router";
import "./SuperAdmin.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./SideBar/Sidebar";
import Header from "./Header/Header";

import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

const SuperAdminLayout = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(true);

  // 🌟 CHECK TOKEN + ROLE
  useEffect(() => {
    const verifySuperAdmin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/superAdmin/me`, {
          withCredentials: true,
        });

        if (res.data?.superAdmin?.role !== "superAdmin") {
          return navigate("/superAdmin/login");
        }

        setLoading(false);
      } catch (err) {
        navigate("/superAdmin/");
      }
    };

    verifySuperAdmin();
  }, [navigate]);

  // 🌙 HANDLE THEME SWITCH
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🌀 Optional: Loading screen before access is confirmed
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Checking access…
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F2F0EF] dark:bg-[#09090B]">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* SIDEBAR */}
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
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="flex-1 mt-16 overflow-y-auto p-6 dark:bg-[#09090B]">
          <Outlet context={{ theme, setTheme }} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
