// src/components/Dashboard/EarningsChart.jsx

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiChevronDown } from "react-icons/fi";

const data = [
  { month: "Jan", value: 70000 },
  { month: "Feb", value: 75000 },
  { month: "Mar", value: 68000 },
  { month: "Apr", value: 60000 },
  { month: "May", value: 58000 },
  { month: "Jun", value: 62000 },
  { month: "Jul", value: 64000 },
  { month: "Aug", value: 70000 },
  { month: "Sep", value: 74000 },
  { month: "Oct", value: 78000 },
  { month: "Nov", value: 82000 },
  { month: "Dec", value: 90000 },
];

export default function EarningsChart({ theme }) {
  const [referralsOnly, setReferralsOnly] = useState(true);
  const [duration, setDuration] = useState("1 month");

  const isDark = theme === "dark";

  return (
    <div
      className={`w-[70%] p-4 rounded-xl border  transition shadow-xl
      ${isDark ? "bg-[#0D0D0F] border-gray-800" : "bg-white border-gray-300"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-900"
          }`}
        >
          Earnings
        </h3>

        <div className="flex items-center gap-4">
          {/* Toggle */}
          <div
            className={`flex items-center gap-2 text-sm ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span>Referrals only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={referralsOnly}
                onChange={() => setReferralsOnly(!referralsOnly)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-400 peer-checked:bg-red-600 rounded-full transition"></div>
              <div className="absolute h-4 w-4 bg-white top-0.5 left-1 rounded-full peer-checked:translate-x-5 transition"></div>
            </label>
          </div>

          {/* Duration Dropdown */}
          <button
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg border transition
              ${
                isDark
                  ? "bg-[#141417] text-gray-300 border-gray-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            {duration}
            <FiChevronDown />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke={isDark ? "#1F1F23" : "#e5e7eb"}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="month" stroke={isDark ? "#aaa" : "#444"} />
            <YAxis
              stroke={isDark ? "#aaa" : "#444"}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: isDark ? "#111" : "#fff",
                border: `1px solid ${isDark ? "#333" : "#ddd"}`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: isDark ? "#fff" : "#000" }}
              itemStyle={{ color: isDark ? "#fff" : "#000" }}
              formatter={(v) => [`$${v.toLocaleString()}`, "Earnings"]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#ef4444" // red-500
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
