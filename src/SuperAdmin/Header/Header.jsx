// src/components/layout/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiGrid,
  FiMessageSquare,
  FiBell,
  FiUser,
  FiX,
} from "react-icons/fi";

/**
 * Metronic-like Header (Demo1)
 * - Logo on left
 * - Search (desktop)
 * - Apps / Chat / Notifications / User menus on right
 * - Mobile sheet that slides in (icons + links)
 * - Dark-mode aware (respects document.documentElement.classList)
 *
 * Drop this file in: src/components/layout/Header.jsx
 */

export default function Header({ onToggleSidebar }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync theme with html.dark
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Optional: close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
    

      <header
        className="fixed top-0 left-0 right-0 z-50 h-16  flex items-center justify-between
          bg-white dark:bg-[#09090B] border-b dark:border-[#1f1f23] px-4"
      >
        {/* Left: Mobile menu button + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => {
              if (isMobile && onToggleSidebar) {
                // If user provided a manual sidebar toggle (optional)
                onToggleSidebar();
              } else {
                // open mobile sheet
                setMobileOpen((s) => !s);
              }
            }}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
            aria-label="open menu"
          >
            <FiMenu size={18} className="text-gray-700 dark:text-gray-200" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
           
            <span className="hidden md:inline-block text-lg font-semibold dark:text-white">
              Super Admin
            </span>
          </Link>
        </div>

        {/* Center: Search (desktop) */}
        {/* <div className="flex-1 flex items-center justify-center">
          <div className="hidden lg:flex items-center w-full max-w-2xl">
            <div
              className="relative w-full"
              title="Search (click the icon to open)"
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-full py-2 pl-10 pr-4 text-sm bg-gray-50 border-gray-200 dark:bg-[#0e0e10] dark:border-[#1f1f23] dark:text-gray-200"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <FiSearch />
              </div>
            </div>
          </div>
        </div> */}

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          {/* Apps */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
            aria-label="open apps"
          >
            <FiGrid className="text-gray-700 dark:text-gray-200" />
          </button>

          {/* Chat */}
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
            aria-label="chat"
          >
            <FiMessageSquare className="text-gray-700 dark:text-gray-200" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
              aria-label="notifications"
            >
              <FiBell className="text-gray-700 dark:text-gray-200" />
            </button>
            {/* small badge */}
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
              3
            </span>
          </div>

          {/* Theme toggle (keeps in sync with sidebar) */}
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
            aria-label="toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* User */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
              aria-label="open user menu"
            >
              <img
                src="/media/avatars/300-1.png"
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="hidden md:inline text-sm dark:text-gray-200">
                Admin
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet / overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/40 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#09090B] border-r dark:border-[#1f1f23] transform transition-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b dark:border-[#1f1f23]">
            <div className="flex items-center gap-3">
              <img src="/media/app/mini-logo.svg" alt="logo" className="h-8" />
              <span className="text-sm font-semibold dark:text-white">
                Super Admin
              </span>
            </div>
            <button
              className="p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="close"
            >
              <FiX className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {/* replicate main menu items (the same as sidebar) */}
            <Link
              to="/adminDashboard"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Dashboard
            </Link>
            <Link
              to="/adminDashboard/companies"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Companies
            </Link>
            <Link
              to="/adminDashboard/plan"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Plan
            </Link>
            <Link
              to="/adminDashboard/plan-request"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Plan Request
            </Link>
            <Link
              to="/adminDashboard/referral-program"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Referral Program
            </Link>
            <Link
              to="/adminDashboard/coupon"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Coupon
            </Link>
            <Link
              to="/adminDashboard/order"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Order
            </Link>
            <Link
              to="/adminDashboard/email-template"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Email Template
            </Link>
            <Link
              to="/adminDashboard/landing-page"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Landing Page
            </Link>
            <Link
              to="/adminDashboard/settings"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Settings
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
