import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FiChevronDown,
  FiChevronRight,
  FiSettings,
  FiHelpCircle,
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
    path: "/adminDashboard/createEnquiry",
  },

  { id: "tasks", title: "Tasks", icon: <FiCheckSquare />, path: "/" },

  {
    id: "members",
    title: "Members",
    icon: <FiUsers />,
    children: [
      { title: "Members", path: "/adminDashboard/members" },
      {
        title: "Inactive Subscription",
        path: "/adminDashboard/inactiveMembers",
      },
      { title: "Enquiry", path: "/adminDashboard/enquiry" },
      { title: "Guest Pass", path: "/adminDashboard/guestPassReview" },
    ],
  },

  {
    id: "adminPlans",
    title: "Plans",
    icon: <FiBox />,
    path: "/adminDashboard/adminPlans",
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
    path: "/adminDashboard/classes",
  },

  {
    id: "class schedule",
    title: "Class Schedule",
    icon: <FiBookOpen />,
    children: [
      { title: "All Schedules", path: "/adminDashboard/allClassScheduleList" },
      { title: "Days Schedules", path: "/adminDashboard/createDaysSchedule" },
      {
        title: "Weeks Schedules",
        path: "/adminDashboard/createWeeklySchedule",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    icon: <FiBox />,
    children: [
      { title: "Products", path: "/adminDashboard/products" },
      { title: "Product Settings", path: "/adminDashboard/productSettings" },
      { title: "Order History", path: "/adminDashboard/orderHistory" },
    ],
  },

  { id: "reports", title: "Reports", icon: <FiBarChart2 />, path: "/" },

  { id: "feedbacks", title: "Feedbacks", icon: <FiMessageCircle />, path: "/" },
];

// New bottom menu section
const BOTTOM_MENU = [
  {
    id: "settings",
    title: "Settings",
    icon: <FiSettings />,
    path: "/adminDashboard/adminSettings",
  },
  {
    id: "help",
    title: "Help",
    icon: <FiHelpCircle />,
    path: "/adminDashboard/help",
  },
];

export default function SidebarMenu({ collapsed = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Open dropdown state
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

  const handleParentClick = (item) => {
    const isOpen = open[item.id];

    setOpen((state) => ({ ...state, [item.id]: !state[item.id] }));

    if (!isOpen && item.children?.length > 0) {
      navigate(item.children[0].path);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* TOP MENU */}
      <nav className="sidebar-menu space-y-1">
        {MENU.map((item) => {
          const isActive =
            item.path &&
            (location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/"));

          // ---------------------------
          // DROPDOWN MENU ITEMS
          // ---------------------------
          if (item.children) {
            const isOpen = open[item.id];

            return (
              <div key={item.id} className="rounded-lg">
                <button
                  onClick={() => handleParentClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                      isOpen
                        ? "bg-gray-200 dark:bg-[#1f1f23] text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#1f1f23]"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>

                  {!collapsed && (
                    <span
                      className={`flex-1 text-sm transition ${
                        isOpen
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}

                  {!collapsed && (
                    <span className="text-gray-600 dark:text-gray-300">
                      {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  )}
                </button>

                {/* SUBMENU */}
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
                              ? "bg-gray-200 dark:bg-[#2A2A2C] text-gray-900 dark:text-white font-medium"
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

          // ---------------------------
          // SINGLE MENU ITEMS
          // ---------------------------
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
              {/* ICON WRAPPER */}
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

      {/* ---------------------------
          BOTTOM FIXED MENU 
      ---------------------------- */}
      <div className="mt-6 pt-4 flex border-t border-gray-300 dark:border-gray-700 space-y-1">
        {BOTTOM_MENU.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-gray-300 dark:bg-[#1f1f23] text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
                }
              `}
            >
              <div
                className={`
                p-2 rounded-xl transition
                ${
                  isActive
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "bg-gray-100 dark:bg-[#1f1f23] text-gray-500 dark:text-gray-300"
                }
              `}
              >
                {item.icon}
              </div>

              {!collapsed && <span className="text-sm">{item.title}</span>}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
