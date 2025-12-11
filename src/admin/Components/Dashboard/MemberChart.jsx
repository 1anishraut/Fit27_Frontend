import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MemberDonutChart = ({
  totalMembers = 0,
  activeMembers = 0,
  name = "",
}) => {
  // Avoid division by zero
  const percentage =
    totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 0;

  // Chart data
  const data = [
    { name: "Active", value: activeMembers },
    { name: "Inactive", value: totalMembers - activeMembers },
  ];

  const COLORS = ["#DC2626", "#E5E7EB"]; // Green + light gray

  // Detect theme
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
    <div
      className="
        border rounded-2xl p-6 shadow-xl transition-all 
        bg-white dark:bg-[#111218]
        border-gray-200 dark:border-gray-700
        w-full 
      "
    >
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {name}
      </h2>

      {/* FLEX WRAPPER (Chart Left, Details Right) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* LEFT — DONUT CHART */}
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeMembers}
            </span>
            <span className="text-gray-600 dark:text-gray-300 text-sm -mt-1">
              active
            </span>
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="flex flex-col items-start">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Total Members
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {totalMembers}
          </p>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-green-500"></span>
            <span className="text-gray-700 dark:text-gray-300">Active</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {activeMembers}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-gray-700 dark:text-gray-300">Inactive</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {totalMembers - activeMembers}
            </span>
          </div>

          {/* Percentage */}
          <p className="mt-4 text-lg font-bold text-red-500 ">
            {percentage}% Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberDonutChart;
