import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Utils/Constants";

export default function Header({ collapsed, setCollapsed, theme, setTheme }) {
  const admin = useSelector((state) => state.admin);
  const brand = useSelector((state) => state.brand); // ⭐ get brand data

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const location = useLocation();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sheet when navigating
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // ⭐ Backend logos converted to full image URLs
  const backendDarkLogo = brand?.logoDark
    ? `${BASE_URL}/${brand.logoDark}`
    : null;

  const backendLightLogo = brand?.logoLight
    ? `${BASE_URL}/${brand.logoLight}`
    : null;

  // ⭐ Choose correct logo based on theme
  const finalLogo =
    theme === "dark"
      ? backendLightLogo || logoLightFallback
      : backendDarkLogo || logoDarkFallback;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 
        flex items-center justify-between bg-white dark:bg-[#09090B]
        border-b border-gray-300 dark:border-[#1f1f23] px-4"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <button
            onClick={() => {
              if (isMobile) setMobileOpen((s) => !s);
              else setCollapsed((prev) => !prev);
            }}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] flex items-center justify-center"
          >
            <FiMenu className="text-gray-700 dark:text-gray-200" size={18} />
          </button>

          {/* ⭐ LOGO FROM BACKEND */}
          <img
            src={finalLogo}
            alt="brand-logo"
            className="h-10 w-auto object-contain transition-all"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            <FiGrid className="text-gray-700 dark:text-gray-200" />
          </button>

          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]">
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
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-300 dark:hover:bg-[#1f1f23] transition"
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

      {/* -- rest unchanged -- */}
    </>
  );
}
