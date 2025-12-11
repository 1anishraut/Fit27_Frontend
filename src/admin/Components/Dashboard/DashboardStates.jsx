import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

import bgPatternDark from "../../../assets/bg-3-dark.png";
import bgPatternLight from "../../../assets/bg-3.png";

const DashboardStats = ({
  newMembers,
  manualBookings,
  onlineBookings,
  todayVisits,
  totalVisits,
}) => {
  // DARK MODE
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      <StatCard
        title="New Members"
        value={newMembers}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Joined in last week — ${new Date().toDateString()}`}
      />

      <StatCard
        title="Today Visit"
        value={todayVisits}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Visits today as of ${new Date().toDateString()}`}
      />

      <StatCard
        title="Member Visit"
        value={totalVisits}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Visits compared with previous period`}
      />

      <StatCard
        title="Manual Bookings"
        value={manualBookings}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Bookings compared with previous period`}
      />

      <StatCard
        title="Online Bookings"
        value={onlineBookings}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Bookings compared with previous period`}
      />
    </div>
  );
};

/* ------------------------------------------------------------
      REUSABLE CARD COMPONENT (THEME MATCHED)
------------------------------------------------------------ */

const StatCard = ({ title, value, description, bg }) => (
  <div
    className="
      relative p-6 rounded-2xl border shadow-xl text-center
      bg-white dark:bg-[#111218]
      border-gray-200 dark:border-gray-700
      hover:border-gray-400 dark:hover:border-gray-500
      transition-all duration-200
    "
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-nowrap">
      {title}
    </h2>

    <div className="text-4xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>

    <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
      <span>(0%)</span>
      <FaArrowUp className="text-xs" />
    </div>

    <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
      {description}
    </p>
  </div>
);

export default DashboardStats;
