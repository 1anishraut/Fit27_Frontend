import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { addMembers } from "../../../Utils/membersSlice";

import bgPatternDark from "../../../assets/bg-3-dark.png";
import bgPatternLight from "../../../assets/bg-3.png";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const allMembersData = useSelector((state) => state.members) || [];

  // MAIN STATES
  const [newMembers, setNewMembers] = useState(0);
  const [manualBookings, setManualBookings] = useState(0);
  const [onlineBookings, setOnlineBookings] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

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

  /* ------------------------------------------------------------
      FETCH STATS
  ------------------------------------------------------------ */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Today visit count
      const todayRes = await axios.get(`${BASE_URL}/access/today/count`, {
        withCredentials: true,
      });
      setTodayVisits(todayRes.data.totalTodayVisits || 0);

      // Total member visits
      const totalRes = await axios.get(`${BASE_URL}/access/total/count`, {
        withCredentials: true,
      });
      setTotalVisits(totalRes.data.totalMemberVisits || 0);

      // Fetch all members ---------------------------------------------------------------
      const membersRes = await axios.get(`${BASE_URL}/user/allUsers`, {
        withCredentials: true,
      });
      const members = membersRes.data.data || [];

      // dispatch(addMembers(members));

      // Manual bookings count
      const manualRes = await axios.get(`${BASE_URL}/user/manual-bookings`, {
        withCredentials: true,
      });
      setManualBookings(manualRes.data.count || 0);

      // Online bookings count
      const onlineRes = await axios.get(`${BASE_URL}/user/online-bookings`, {
        withCredentials: true,
      });
      setOnlineBookings(onlineRes.data.count || 0);

      // New members in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const newMembersCount = members.filter(
        (m) => new Date(m.createdAt) >= sevenDaysAgo
      ).length;

      setNewMembers(newMembersCount);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      {/* ---------- NEW MEMBERS ---------- */}
      <StatCard
        title="New Members"
        value={newMembers}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Joined in last week — ${new Date().toDateString()}`}
      />

      {/* ---------- TODAY VISIT ---------- */}
      <StatCard
        title="Today Visit"
        value={todayVisits}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Visits today as of ${new Date().toDateString()}`}
      />

      {/* ---------- TOTAL MEMBER VISITS ---------- */}
      <StatCard
        title="Member Visit"
        value={totalVisits}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Visits compared with previous period`}
      />

      {/* ---------- MANUAL BOOKINGS ---------- */}
      <StatCard
        title="Manual Bookings"
        value={manualBookings}
        bg={isDark ? bgPatternDark : bgPatternLight}
        description={`Bookings compared with previous period`}
      />

      {/* ---------- ONLINE BOOKINGS ---------- */}
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
      REUSABLE CARD COMPONENT
------------------------------------------------------------ */

const StatCard = ({ title, value, description, bg }) => (
  <div
    className="relative p-6 rounded-xl border shadow-xl text-center
    bg-white dark:bg-[#0D0D0F]
    border-gray-300 dark:border-gray-700
    hover:border-gray-500 transition-all"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
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
