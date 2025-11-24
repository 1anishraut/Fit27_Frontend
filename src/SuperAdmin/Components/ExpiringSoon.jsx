import React from "react";
import { FaLinkedin, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

// Background patterns
import bgPatternDark from "../Images/bg-3-dark.png";
import bgPatternLight from "../Images/bg-3.png";

const stats = [
  {
    id: 1,
    icon: <FiClock size={60}/>,
    value: "Expiring Soon",
    label: "Total Companies 7",
  },
];

export default function ExpriringSoon() {
  // detect theme
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="flex gap-6 w-[30%] ">
      {stats.map((item) => (
        <div
          key={item.id}
          className="w-full relative p-6 rounded-xl border border-gray-800 
          bg-[#0D0D0F] dark:bg-[#0D0D0F]
          hover:border-gray-700 transition backdrop-blur-sm"
          style={{
            backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* ICON */}
          <div className="mb-3">{item.icon}</div>

          {/* VALUE */}
          <h2 className="text-3xl font-bold text-white">{item.value}</h2>

          {/* LABEL */}
          <p className="text-gray-400 text-sm mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
