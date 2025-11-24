import React from "react";
import { FaLinkedin, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

// Background patterns
import bgPatternDark from "../Images/bg-3-dark.png";
import bgPatternLight from "../Images/bg-3.png";

const stats = [
  {
    id: 1,
    icon: <FaLinkedin className="text-[#0A66C2]" size={28} />,
    value: "3",
    label: "Total Companies",
  },
  {
    id: 2,
    icon: <FaYoutube className="text-[#FF0000]" size={28} />,
    value: "24",
    label: "Total Orders",
  },
  {
    id: 3,
    icon: <FaInstagram className="text-[#E1306C]" size={28} />,
    value: "608",
    label: "Total Plans",
  },
 
];

export default function StatsGrid() {
  // detect theme
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="flex gap-6">
      {stats.map((item) => (
        <div
          key={item.id}
          className="relative p-6 rounded-xl border border-gray-800 
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
