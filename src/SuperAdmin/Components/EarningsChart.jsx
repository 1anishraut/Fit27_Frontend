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

export default function EarningsChart() {
  const [referralsOnly, setReferralsOnly] = useState(true);
  const [duration, setDuration] = useState("1 month");

  return (
    <div
      className="w-[70%] p-4 rounded-xl border border-gray-800 bg-[#0D0D0F] dark:bg-[#0D0D0F] 
        shadow-lg"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Earnings</h3>

        <div className="flex items-center gap-4">
          {/* Toggle */}
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span>Referrals only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={referralsOnly}
                onChange={() => setReferralsOnly(!referralsOnly)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-red-600 transition"></div>
              <div
                className="absolute h-4 w-4 bg-white rounded-full top-0.5 left-1 
                  peer-checked:translate-x-5 transition"
              ></div>
            </label>
          </div>

          {/* Dropdown */}
          <button
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg
              bg-[#141417] border border-gray-700 text-gray-300 hover:border-gray-600"
          >
            {duration}
            <FiChevronDown />
          </button>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#1F1F23" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis
              stroke="#888"
              tickFormatter={(v) => `$${v / 1000}k`}
              domain={[0, "dataMax + 20000"]}
            />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(v) => [`$${v.toLocaleString()}`, "Earnings"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ff0000"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
