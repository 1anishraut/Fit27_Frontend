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
import { LuShoppingCart } from "react-icons/lu";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import UserMenu from "./UserMenu";
import MobileSidebar from "../SideBar/MobileSidebar";

export default function Header({ collapsed, setCollapsed, theme, setTheme }) {
  const admin = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- BRAND STATE (DIRECT FETCH) ---------------- */
  const [brand, setBrand] = useState(null);

  /* ---------------- UI STATES ---------------- */
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ---------------- DETECT MOBILE ---------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- CLOSE MENUS ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  /* ---------------- FETCH BRAND ---------------- */
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/adminBrand/all`, {
          withCredentials: true,
        });
        setBrand(res.data?.data?.[0] || null);
      } catch (err) {
        console.error("Header brand fetch error:", err);
        setBrand(null);
      }
    };

    fetchBrand();
  }, []);

  /* ---------------- LOGO LOGIC (NO FALLBACKS) ---------------- */
  const backendDarkLogo = brand?.adminLogoDark
    ? `${BASE_URL}/${brand.adminLogoDark}`
    : null;

  const backendLightLogo = brand?.adminLogoLight
    ? `${BASE_URL}/${brand.adminLogoLight}`
    : null;

  const finalLogo = theme === "dark" ? backendLightLogo : backendDarkLogo;

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

          {/* LOGO (only if exists) */}
          <Link to="/adminDashboard" className="flex items-center gap-2">
            {finalLogo && (
              <img
                src={finalLogo}
                alt="brand-logo"
                className="h-8 w-auto object-contain transition-all"
              />
            )}
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/adminDashboard/cart")}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            title="Cart"
          >
            <LuShoppingCart className="text-gray-700 dark:text-gray-200" />
          </button>

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
          <div
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#09090B]
            rounded-2xl shadow-2xl border border-gray-200 dark:border-[#1f1f23] p-4"
          >
            <input
              placeholder="Search modules, pages..."
              className="w-full border border-gray-300 dark:border-[#1f1f23]
              rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0D0D0F]
              text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
