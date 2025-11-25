import React from "react";
import { CgGym } from "react-icons/cg";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaMapMarkerAlt } from "react-icons/fa";
// Dummy data
const data = [
  { name: "Active", value: 10 },
  { name: "Inactive", value: 25 },
];

const COLORS = ["#FF0000", "#E5E7EB"]; // Indigo + Light Gray

const Inactive_Total = () => {
  const totalMembers = data.reduce((acc, cur) => acc + cur.value, 0);
  const activeMembers = data[0].value;

  return (
    <div className="w-full flex flex-wrap gap-6">
      {/* TOTAL PACKAGES CARD */}
      <div className="w-full md:w-1/2 lg:w-[30%]">
        <div
          className="border border-gray-300 dark:border-gray-700 
          rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-md"
        >
          <h2 className="text-lg font-semibold mb-6 dark:text-white">
            Total Packages
          </h2>

          <div className="flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={55}
                    outerRadius={80}
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
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold dark:text-white">
                  {totalMembers}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm -mt-1">
                  {/* total members */}
                </span>
              </div>

              {/* Bottom Percentage */}
              <div className="absolute bottom-6 text-center">
                <span className="text-black dark:text-white font-semibold">
                  {/* {((activeMembers / totalMembers) * 100).toFixed(1)}% */}
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
      </div>

      {/* INACTIVE GYMS LIST */}
      <div
        className="w-full md:w-1/2 lg:w-[60%] rounded-xl overflow-hidden 
        border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0D0D0F] shadow-md"
      >
        {/* Header */}
        <div
          className="h-[40px] px-4 flex justify-between items-center 
          bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-700"
        >
          <h1 className="text-md font-semibold dark:text-white">
            Inactive GYMs
          </h1>
          <CgGym size={24} className="text-gray-900 dark:text-white" />
        </div>

        {/* Gym List */}
        <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 space-y-3">
          {[
            { name: "Powerhouse Gym", location: "Mumbai, India" },
            { name: "Fitness One", location: "Delhi, India" },
            { name: "Silhouette Fitness", location: "Bangalore, India" },
            { name: "Reach Fitness", location: "Chennai, India" },
            { name: "Talwalkars", location: "Pune, India" },
          ].map((gym, i) => (
            <div
              key={i}
              className="pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between"
            >
              {/* Gym Name */}
              <h2 className="font-semibold dark:text-white">{gym.name}</h2>

              {/* Location Row */}
              <div className="flex items-center justify-start gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-red-500" size={12} />
                <span>{gym.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inactive_Total;
