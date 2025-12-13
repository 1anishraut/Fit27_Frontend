import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header/Header";
import Sidebar from "./SideBar/Sidebar";

const UserLayout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  /* =====================================================
     VALIDATE USER SESSION
  ===================================================== */
  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        /* 🔧 FIX #3 — STRICT SUCCESS CHECK */
        if (res.data?.success !== true) {
          navigate("/user", { replace: true });
          return;
        }

        console.log(res.data.user);

        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        navigate("/user", { replace: true });
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  /* =====================================================
     THEME HANDLING
  ===================================================== */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =====================================================
     LOADING STATE
  ===================================================== */
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Checking access…
      </div>
    );
  }

  /* =====================================================
     LAYOUT
  ===================================================== */
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F2F0EF] dark:bg-[#09090B]">
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className={`flex flex-col h-full transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* SIDEBAR */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme}
          setTheme={setTheme}
        />
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

export default UserLayout;
