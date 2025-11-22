import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../Utils/Constants";
import axios from "axios";
import { addAdmin } from "../Utils/adminSlice";
import { NavLink, useNavigate } from "react-router-dom";

// Icons
import { MdDarkMode } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import logo from "../assets/logo.webp";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);

  const [open, setOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply Theme to HTML tag
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Fetch Admin Data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/me", {
          withCredentials: true,
        });
        dispatch(addAdmin(res?.data));
      } catch (error) {
        console.log("No active session or token expired");
      }
    };
    fetchAdmin();
  }, [dispatch]);

  // Logout Handler
  const logout = async () => {
    try {
      await axios.post(
        BASE_URL + "/admin/logout",
        {},
        { withCredentials: true }
      );
      navigate("/admin");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full border-b border-gray-300 bg-white dark:bg-gray-200 dark:text-white px-6 py-3 shadow-sm flex justify-between items-center z-50">
      {/* LEFT SIDE LOGO */}
      <div className="flex items-center gap-3 ml-10">
        <NavLink to="/">
          <img src={logo} alt="logo" className="h-8" />
        </NavLink>
      </div>

      {/* RIGHT SIDE PROFILE */}
      <div className="flex items-center gap-5 relative">
        {/* Profile Button */}
        <button
          className="flex items-center gap-2"
          onClick={() => setOpen(!open)}
        >
          <FiUser
            size={26}
            className="text-blue-700 dark:text-white border rounded-full p-1 bg-gray-100 dark:bg-gray-700"
          />
          <span className="text-blue-700 dark:text-white font-medium">
            {admin?.managerName}
          </span>
          <span className="text-gray-600 dark:text-gray-400">▾</span>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50 border dark:border-gray-600">
            {/* Profile Details */}
            <div className="flex items-center gap-3 mb-4">
              <FiUser size={36} className="text-blue-700 dark:text-white" />

              <div>
                <p className="font-semibold text-sm">{admin?.managerName}</p>
                <p className="text-gray-500 text-xs dark:text-gray-400">
                  {admin?.managerId}
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center gap-2">
                <MdDarkMode size={18} className="dark:text-yellow-300" />
                <span>Dark Mode</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
                <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* My Account */}
            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <FiUser />
              <span>My Account</span>
            </div>

            {/* Logout */}
            <div
              className="flex items-center gap-2 py-2 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-500"
              onClick={logout}
            >
              <FiLogOut />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
