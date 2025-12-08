import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FiMessageSquare,
  FiCheckSquare,
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiBarChart2,
  FiBookOpen,
  FiMessageCircle,
  FiUserCheck,
  FiCalendar,
  FiVolume2,
  FiGlobe,
  FiUser,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const MENU = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <MdDashboard />,
    path: "/adminDashboard/allDetails",
  },

  {
    id: "enquiries",
    title: "Enquiries",
    icon: <FiMessageSquare />,
    path: "/",
  },

  {
    id: "tasks",
    title: "Tasks",
    icon: <FiCheckSquare />,
    path: "/",
  },

  {
    id: "members",
    title: "Members",
    icon: <FiUsers />,
    children: [
      { title: "Enquiry", path: "/adminDashboard/members/enquiry" },
      { title: "Members", path: "/adminDashboard/members" },
    ],
  },

  {
    id: "orders",
    title: "Orders",
    icon: <FiShoppingCart />,
    path: "/",
  },

  {
    id: "products",
    title: "Products",
    icon: <FiBox />,
    path: "/",
  },

  {
    id: "adminPlans",
    title: "Plans",
    icon: <FiBox />,
    path: "/adminDashboard/adminPlans",
  },

  {
    id: "reports",
    title: "Reports",
    icon: <FiBarChart2 />,
    path: "/",
  },

  {
    id: "instructors",
    title: "Instructors",
    icon: <FiUserCheck />,
    path: "/adminDashboard/instructors",
  },

  {
    id: "classes",
    title: "Classes",
    icon: <FiBookOpen />,
    children: [
      {
        title: "All Classes",
        path: "/adminDashboard/classes",
      },
      {
        title: "Days Schedules",
        path: "/adminDashboard/daysSchedule",
      },
      {
        title: "Weeks Schedules",
        path: "/adminDashboard/weeks-schedule",
      },
    ],
  },

  {
    id: "feedbacks",
    title: "Feedbacks",
    icon: <FiMessageCircle />,
    path: "/",
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
        // 🔻 DROPDOWN MENU
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
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#1f1f23]"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>

                {!collapsed && (
                  <span
                    className={`
                      flex-1 text-sm transition
                      ${
                        isOpen
                          ? "text-gray-900 dark:text-black"
                          : "text-gray-900 dark:text-gray-300"
                      }
                    `}
                  >
                    {item.title}
                  </span>
                )}

                {!collapsed && (
                  <span className="text-gray-500 dark:text-gray-300">
                    {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                )}
              </button>

              <div
                className={`pl-10 mt-1 space-y-1 overflow-hidden transition-all ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
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
                            : "text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
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
        // 🔹 SINGLE-LEVEL MENU ITEM
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
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
              }
              `
            }
          >
            {/* ICON BOX */}
            <div
              className={`
                p-2 rounded-xl transition
                ${
                  location.pathname.startsWith(item.path)
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "bg-gray-100 text-gray-500 dark:bg-[#1f1f23] dark:text-gray-300"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
            </div>

            {/* TITLE */}
            {!collapsed && (
              <span
                className={`
                  text-sm transition
                  ${
                    location.pathname.startsWith(item.path)
                      ? "text-white dark:text-black"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {item.title}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
