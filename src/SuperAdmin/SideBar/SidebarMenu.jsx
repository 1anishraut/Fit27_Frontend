import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiShoppingBag,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const MENU = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <FiHome />,
    path: "/superAdminDashboard/home",
  },

  {
    id: "details",
    title: "All Details",
    icon: <FiUsers />,
    children: [
      { title: "Option 1", path: "/adminDashboard/allDetails/option1" },
      { title: "Option 2", path: "/adminDashboard/allDetails/option2" },
      { title: "Option 3", path: "/adminDashboard/allDetails/option3" },
    ],
  },

  {
    id: "companies",
    title: "Companies",
    icon: <FiUsers />,
    path: "/adminDashboard/companies",
  },
  {
    id: "plan",
    title: "Plan",
    icon: <FiClipboard />,
    path: "/adminDashboard/plan",
  },
  {
    id: "planReq",
    title: "Plan Request",
    icon: <FiClipboard />,
    path: "/adminDashboard/plan-request",
  },
  {
    id: "referral",
    title: "Referral Program",
    icon: <FiUsers />,
    path: "/adminDashboard/referral",
  },
  {
    id: "coupon",
    title: "Coupon",
    icon: <FiShoppingBag />,
    path: "/adminDashboard/coupon",
  },
  {
    id: "order",
    title: "Order",
    icon: <FiShoppingBag />,
    path: "/adminDashboard/order",
  },
  {
    id: "emailTemp",
    title: "Email Template",
    icon: <FiClipboard />,
    path: "/adminDashboard/email-template",
  },
  {
    id: "landingPage",
    title: "Landing Page",
    icon: <FiHome />,
    path: "/adminDashboard/landing-page",
  },
  {
    id: "settings",
    title: "Settings",
    icon: <FiSettings />,
    path: "/adminDashboard/settings",
  },
];

export default function SidebarMenu({ collapsed = false }) {
  const location = useLocation();

  const [open, setOpen] = useState(() => {
    const obj = {};
    MENU.forEach((item) => {
      if (item.children) {
        obj[item.id] = item.children.some((c) =>
          location.pathname.startsWith(c.path)
        );
      }
    });
    return obj;
  });

  const toggle = (id) => setOpen((s) => ({ ...s, [id]: !s[id] }));

  return (
    <nav className="sidebar-menu space-y-1">
      {MENU.map((item) => {
        const isActive =
          item.path &&
          (location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/"));

        //
        // 🔹 Parent with dropdown
        //
        if (item.children) {
          const isOpen = open[item.id];

          return (
            <div key={item.id} className="rounded-lg">
              <button
                onClick={() => toggle(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isOpen
                      ? "bg-gray-100 dark:bg-[#1f1f23] text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#1f1f23]"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <span className="flex-1 text-sm">{item.title}</span>
                )}
                {!collapsed && (
                  <span className="text-gray-500 dark:text-gray-300">
                    {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                )}
              </button>

              {/* Dropdown menu */}
              <div
                className={`pl-10 mt-1 space-y-1 overflow-hidden transition-all 
                ${isOpen ? "max-h-96" : "max-h-0"}`}
              >
                {item.children.map((c, idx) => {
                  const subActive =
                    location.pathname === c.path ||
                    location.pathname.startsWith(c.path + "/");

                  return (
                    <NavLink
                      key={idx}
                      to={c.path}
                      className={`
                        block px-3 py-2 rounded-lg text-sm transition
                        ${
                          subActive
                            ? "bg-gray-200 dark:bg-white text-gray-900 dark:text-black font-medium"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
                        }
                      `}
                    >
                      {collapsed ? c.title.charAt(0) : c.title}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        }

        //
        // 🔹 Single-level menu item
        //
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3 w-full px-3 py-2 rounded-lg transition
              ${
                isActive
                  ? "active-menu bg-black text-white dark:bg-white dark:text-black shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
              }
              `
            }
          >
            <div
              className={`p-2 rounded-xl transition
                ${
                  isActive
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "bg-gray-100 text-gray-500 dark:bg-[#1f1f23] dark:text-gray-300"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
            </div>

            {!collapsed && <span className="text-sm">{item.title}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}
