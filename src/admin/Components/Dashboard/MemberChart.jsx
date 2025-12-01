import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MemberDonutChart = ({ totalMembers, activeMembers, name }) => {
  const data = [{ name: "Active", value: activeMembers }];

  // 🔥 Force chart color to red-600
  const COLORS = ["#DC2626"]; // tailwind red-600

  // 🌗 Detect dark mode
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
      className={`
        border rounded-xl p-6 shadow-xl w-1/2 transition-all
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
      `}
    >
      <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
        {name}
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={448}
              >
                <Cell fill={COLORS[0]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Number */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalMembers}
            </span>
            <span className="text-gray-600 dark:text-gray-300 text-sm -mt-1">
              total members
            </span>
          </div>

          {/* Percentage */}
          <div className="absolute bottom-6 text-center">
            <span className="text-black dark:text-white font-semibold">
              {((activeMembers / totalMembers) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-5">
          <span
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: COLORS[0] }}
          ></span>

          <span className="text-gray-700 dark:text-gray-300">Active</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            {activeMembers}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemberDonutChart;
