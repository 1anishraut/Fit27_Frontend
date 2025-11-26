import React, { useEffect, useState } from "react";

import { FaBuilding } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { TbFaceIdError, TbUsers } from "react-icons/tb";

// Background patterns
import bgPatternDark from "../Images/bg-3-dark.png";
import bgPatternLight from "../Images/bg-3.png";

const stats = [
  {
    id: 1,
    icon: <FaBuilding className="text-[#0A66C2]" size={28} />,
    value: "3",
    label: "Total GYMs",
  },
  {
    id: 2,
    icon: <GiGymBag className="text-[#FF0000]" size={28} />,
    value: "24",
    label: "Active GYMs",
  },
  {
    id: 3,
    icon: <TbFaceIdError className="text-[#E1306C]" size={28} />,
    value: "608",
    label: "Inactive GYMs",
  },
  {
    id: 4,
    icon: <TbUsers className="text-[#E1306C]" size={28} />,
    value: "608",
    label: "GYM with most Users",
  },
];

export default function StatsGrid() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Listen to theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex gap-6 w-full ">
      {stats.map((item) => (
        <div
          key={item.id}
          className="relative p-6 rounded-xl border w-[20%] shadow-xl
          bg-white dark:bg-[#0D0D0F]
          border-gray-300 dark:border-gray-700
          hover:border-gray-500 transition-all "
          style={{
            backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* ICON */}
          <div className="mb-3">{item.icon}</div>

          {/* VALUE */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {item.value}
          </h2>

          {/* LABEL */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
