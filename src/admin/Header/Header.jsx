// src/admin/Header/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiGrid,
  FiMessageSquare,
  FiBell,
  FiUser,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Utils/Constants";
import UserMenu from "./UserMenu";

// Fallback logos
import logoDarkFallback from "../../assets/logo.webp";
import logoLightFallback from "../../assets/logo.webp";

import MobileSidebar from "../SideBar/MobileSidebar";

export default function Header({ collapsed, setCollapsed, theme, setTheme }) {
  const admin = useSelector((state) => state.admin);
 const brand = useSelector((state) => state.adminBrand);
  const navigate = useNavigate();



  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const location = useLocation();

  // 🔹 Detect Mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Close menus whenever route changes
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // ----------------------------------------------------------
  //  FIXED: CORRECT LOGO URLS FROM BACKEND (Admin Branding)
  // ----------------------------------------------------------
  const backendDarkLogo = brand?.adminLogoDark
    ? `${BASE_URL}/${brand.adminLogoDark}`
    : null;

  const backendLightLogo = brand?.adminLogoLight
    ? `${BASE_URL}/${brand.adminLogoLight}`
    : null;

  // Debugging
  // console.log("Dark Logo:", backendDarkLogo);
  // console.log("Light Logo:", backendLightLogo);

  // ----------------------------------------------------------
  // 🔥 FIXED: THEME-BASED DYNAMIC LOGO SWITCHING
  // ----------------------------------------------------------
  const finalLogo =
    theme === "dark"
      ? backendLightLogo || logoLightFallback
      : backendDarkLogo || logoDarkFallback;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between 
        bg-white dark:bg-[#09090B] border-b border-gray-300 dark:border-[#1f1f23] px-4"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isMobile) setMobileOpen((s) => !s);
              else setCollapsed((prev) => !prev);
            }}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            <FiMenu className="text-gray-700 dark:text-gray-200" size={18} />
          </button>

          {/* LOGO */}
          <Link to="/adminDashboard" className="flex items-center gap-2">
            <img
              src={finalLogo}
              alt="brand-logo"
              className="h-8 w-auto object-contain transition-all"
            />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            <FiGrid className="text-gray-700 dark:text-gray-200" />
          </button>

          <button
            // onClick={navigate("/adminDashboard/enquiry")}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            <FiMessageSquare className="text-gray-700 dark:text-gray-200" />
          </button>

          <div className="relative">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]">
              <FiBell className="text-gray-700 dark:text-gray-200" />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </div>

          {/* THEME SWITCH */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            {theme === "dark" ? (
              <FiSun size={18} className="text-yellow-300" />
            ) : (
              <FiMoon size={18} className="text-gray-700" />
            )}
          </button>

          {/* USER MENU */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
            >
              <FiUser className="text-gray-700 dark:text-gray-200" />
              <span className="hidden md:inline text-sm dark:text-gray-200">
                Welcome, {admin?.firstName || "Admin"}
              </span>
            </button>

            {userMenuOpen && (
              <UserMenu onClose={() => setUserMenuOpen(false)} />
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#09090B]
            shadow-xl border-r border-gray-200 dark:border-[#1f1f23] overflow-y-auto"
          >
            <div
              className="flex items-center justify-between px-4 h-16 border-b 
              border-gray-200 dark:border-[#1f1f23]"
            >
              <span className="text-sm font-semibold dark:text-white">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
              >
                <FiX className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <MobileSidebar
              isMobile={true}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* SEARCH PANEL */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#09090B] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#1f1f23] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold dark:text-white">
                Quick actions
              </h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
              >
                <FiX className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <input
              placeholder="Search modules, pages..."
              className="w-full border border-gray-300 dark:border-[#1f1f23] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
