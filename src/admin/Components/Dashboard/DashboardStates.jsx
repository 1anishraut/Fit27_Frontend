import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { addMembers } from "../../../Utils/membersSlice";

// 🌈 Theme background patterns (same as StatsGrid)
import bgPatternDark from "../../../assets/bg-3-dark.png";
import bgPatternLight from "../../../assets/bg-3.png";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const allMembersData = useSelector((state) => state.members) || [];

  const [newMembers, setNewMembers] = useState(0);
  const [manualBookings, setManualBookings] = useState(0);

  // Detect dark mode (same behavior as StatsGrid)
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

  // const allMembers = async () => {
  //   try {
  //     const res = await axios.get(BASE_URL + "/allUsers");
  //     dispatch(addMembers(res.data || []));

  //     const today = new Date().toDateString();

  //     const filtered = (res.data || []).filter(
  //       (item) => new Date(item.createdAt).toDateString() === today
  //     );
  //     setNewMembers(filtered.length);

  //     const filterManualBookings = (res.data || []).filter(
  //       (item) => item.bookingFrom === "Manual Booking"
  //     );
  //     setManualBookings(filterManualBookings.length);
  //   } catch (err) {
  //     console.error(err);
  //     setNewMembers(0);
  //     setManualBookings(0);
  //   }
  // };

  // useEffect(() => {
  //   allMembers();
  // }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      {/* ----------- NEW MEMBERS ----------- */}
      <div
        className="relative p-6 rounded-xl border shadow-xl text-center
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 transition-all"
        style={{
          backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          New Members
        </h2>

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {newMembers}
        </div>

        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          Joined since 01 weeks compared with {new Date().toDateString()}
        </p>
      </div>

      {/* ----------- TODAY VISIT ----------- */}
      <div
        className="relative p-6 rounded-xl border shadow-xl text-center
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 transition-all"
        style={{
          backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Today Visit
        </h2>

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          0
        </div>

        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          Successful visits today so far compared with the same time on 16th Sep
          06:55 pm
        </p>
      </div>

      {/* ----------- MEMBER VISIT ----------- */}
      <div
        className="relative p-6 rounded-xl border shadow-xl text-center
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 transition-all"
        style={{
          backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Member Visit
        </h2>

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          0
        </div>

        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          Visits from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>

      {/* ----------- MANUAL BOOKINGS ----------- */}
      <div
        className="relative p-6 rounded-xl border shadow-xl text-center
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 transition-all"
        style={{
          backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Manual Bookings
        </h2>

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {manualBookings}
        </div>

        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          Bookings from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>

      {/* ----------- ONLINE BOOKINGS ----------- */}
      <div
        className="relative p-6 rounded-xl border shadow-xl text-center
        bg-white dark:bg-[#0D0D0F]
        border-gray-300 dark:border-gray-700
        hover:border-gray-500 transition-all"
        style={{
          backgroundImage: `url(${isDark ? bgPatternDark : bgPatternLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Online Bookings
        </h2>

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {(allMembersData?.length || 0) - manualBookings}
        </div>

        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          Bookings from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;
