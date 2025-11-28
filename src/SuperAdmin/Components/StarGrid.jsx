import React, { useEffect, useState } from "react";

import { FaBuilding } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { TbFaceIdError, TbUsers } from "react-icons/tb";

import bgPatternDark from "../Images/bg-3-dark.png";
import bgPatternLight from "../Images/bg-3.png";

import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function StatsGrid() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  /* ----------------------------------------------
    FETCH ADMINS FROM BACKEND
  ---------------------------------------------- */
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/all`, {
          withCredentials: true,
        });
        setAdmins(res.data.data || []); // admin array
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  /* ----------------------------------------------
    COMPUTE STATS
  ---------------------------------------------- */
  const totalGyms = admins.length;
  const activeGyms = admins.filter((a) => a.active === true).length;
  const inactiveGyms = admins.filter((a) => a.active === false).length;

  const gymWithMostUsers =
    admins.length > 0
      ? admins.reduce((max, gym) =>
          (gym.users?.length || 0) > (max.users?.length || 0) ? gym : max
        ).gymName
      : "N/A";

  const stats = [
    {
      id: 1,
      icon: <FaBuilding className="text-[#0A66C2]" size={28} />,
      value: totalGyms,
      label: "Total GYMs",
    },
    {
      id: 2,
      icon: <GiGymBag className="text-[#FF0000]" size={28} />,
      value: activeGyms,
      label: "Active GYMs",
    },
    {
      id: 3,
      icon: <TbFaceIdError className="text-[#E1306C]" size={28} />,
      value: inactiveGyms,
      label: "Inactive GYMs",
    },
    {
      id: 4,
      icon: <TbUsers className="text-[#E1306C]" size={28} />,
      value: gymWithMostUsers,
      label: "GYM with Most Users",
    },
  ];

  /* ----------------------------------------------
    WATCH THEME CHANGE (light/dark)
  ---------------------------------------------- */
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

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="flex gap-6 w-full">
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
