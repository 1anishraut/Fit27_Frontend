import { NavLink } from "react-router-dom";

import bgPatternDark from "../../../assets/bg-3-dark.png";
import bgPatternLight from "../../../assets/bg-3.png";
import { useEffect, useState } from "react";

const DashboardCard = ({ icon, title, route }) => {
  // Dynamic theme tracking
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

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
    <NavLink
      to={route}
      className={`
        relative flex flex-col items-center justify-center 
        p-6 rounded-xl border shadow-xl transition-all cursor-pointer
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 hover:-translate-y-1
      `}
      style={{
        backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ICON */}
      <div className="mb-3 text-3xl">{icon}</div>

      {/* TITLE */}
      <p className="text-gray-800 dark:text-white text-lg font-semibold">
        {title}
      </p>
    </NavLink>
  );
};

export default DashboardCard;
