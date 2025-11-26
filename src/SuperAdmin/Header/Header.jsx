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
import logoDark from "../Images/mb_logo_dark.png";
import logoLight from "../Images/mb_logo_light.png";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";


export default function Header({ collapsed, setCollapsed, theme, setTheme }) {
  const superAdmin = useSelector((state) => state.superAdmin);
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
  console.log(superAdmin); // getting null value here
  

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
              if (isMobile) {
                setMobileOpen((s) => !s);
              } else {
                setCollapsed((prev) => !prev);
              }
            }}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23] flex items-center justify-center"
          >
            <FiMenu className="text-gray-700 dark:text-gray-200" size={18} />
          </button>

          {/* Logo */}
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="logo"
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

          {/* THEME TOGGLE */}
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

          {/* USER MENU DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-300 dark:hover:bg-[#1f1f23] transition"
            >
              <FiUser className="text-gray-700 dark:text-gray-200" />
              <span className="hidden md:inline text-sm dark:text-gray-200">
                Welcome, Super Admin
              </span>
            </button>

            {userMenuOpen && (
              <UserMenu onClose={() => setUserMenuOpen(false)} />
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE SIDEBAR */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 bottom-0 w-64 
    bg-white dark:bg-[#09090B] border-r border-gray-300 dark:border-[#1f1f23]
    transform transition-transform 
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* HEADER */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-300 dark:border-[#1f1f23]">
            <span className="text-sm font-semibold dark:text-white">
              Super Admin
            </span>

            <button className="p-2" onClick={() => setMobileOpen(false)}>
              <FiX className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          {/* MENU ITEMS — SAME AS SIDEBAR */}
          <nav className="p-4 space-y-1">
            <Link
              to="/adminDashboard"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 
        hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Dashboard
            </Link>

            {/* ALL DETAILS DROPDOWN */}
            <details>
              <summary
                className="cursor-pointer px-3 py-2 rounded-lg 
        text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
              >
                All Details
              </summary>
              <div className="pl-6 pt-1 space-y-1">
                <Link
                  to="/adminDashboard/allDetails/option1"
                  className="block px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                >
                  Option 1
                </Link>
                <Link
                  to="/adminDashboard/allDetails/option2"
                  className="block px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                >
                  Option 2
                </Link>
                <Link
                  to="/adminDashboard/allDetails/option3"
                  className="block px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                >
                  Option 3
                </Link>
              </div>
            </details>

            <Link
              to="/adminDashboard/companies"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Companies
            </Link>

            <Link
              to="/adminDashboard/plan"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Plan
            </Link>

            <Link
              to="/adminDashboard/plan-request"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Plan Request
            </Link>

            <Link
              to="/adminDashboard/referral"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Referral Program
            </Link>

            <Link
              to="/adminDashboard/coupon"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Coupon
            </Link>

            <Link
              to="/adminDashboard/order"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Order
            </Link>

            <Link
              to="/adminDashboard/email-template"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Email Template
            </Link>

            <Link
              to="/adminDashboard/landing-page"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Landing Page
            </Link>

            <Link
              to="/adminDashboard/settings"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Settings
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
