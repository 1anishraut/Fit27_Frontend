import React from "react";
import { FiClock } from "react-icons/fi";

// Background patterns
import bgPatternDark from "../Images/bg-3-dark.png";
import bgPatternLight from "../Images/bg-3.png";

const stats = [
  {
    id: 1,
    icon: <FiClock size={60} />,
    value: "Expiring Soon",
    label: "Total Companies 7",
  },
];

export default function ExpiringSoon() {
  return (
    <div className="flex gap-6 w-[30%]">
      {stats.map((item) => (
        <div
          key={item.id}
          className={`
            relative w-full p-6 rounded-xl border 
            bg-white dark:bg-[#0D0D0F]
            border-gray-300 dark:border-gray-800
            hover:border-gray-400 dark:hover:border-gray-700
            overflow-hidden transition
          `}
          style={{
            backgroundImage: `url(${bgPatternLight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* DARK MODE BACKGROUND (Image override) */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
            style={{
              backgroundImage: `url(${bgPatternDark})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* CONTENT */}
          <div className="relative">
            {/* ICON */}
            <div className="mb-3">{item.icon}</div>

            {/* TEXT */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
