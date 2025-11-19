import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MemberDonutChart = ({ totalMembers, activeMembers, name, color }) => {
  const data = [{ name: "Active", value: activeMembers }];

  const COLORS = [color];

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-1/2">
      <h2 className="text-lg font-semibold mb-6">{name}</h2>

      <div className="flex flex-col items-center">
        {/* Donut Chart Container */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Recharts Donut */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={448}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Number */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold">{totalMembers}</span>
            <span className="text-gray-600 text-sm -mt-1">total members</span>
          </div>

          {/* Bottom Percentage */}
          <div className="absolute bottom-6 text-center">
            <span className="text-black font-semibold ">
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

          <span className="text-gray-700">Active</span>
          <span className="text-gray-900 font-semibold">{activeMembers}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberDonutChart;
