import React, { act, useEffect, useState } from "react";
import DashboardCard from "./Components/Dashboard/DashboardCards";
import { FaPlus, FaQuestion, FaTasks } from "react-icons/fa";
import { HiOutlineQrCode } from "react-icons/hi2";
import DashboardStats from "./Components/Dashboard/DashboardStates";
import MemberChart from "./Components/Dashboard/MemberChart";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import CalendarView from "../CalendarView";
import CalendarFull from "../CalendarFull";

const AllDetails = () => {
  // MAIN STATES
  const [newMembers, setNewMembers] = useState(0);
  const [manualBookings, setManualBookings] = useState(0);
  const [onlineBookings, setOnlineBookings] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

  // NEW → Members for chart
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);

  /* ------------------------------------------------------------
      FETCH STATS
  ------------------------------------------------------------ */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Today visits
      const todayRes = await axios.get(`${BASE_URL}/access/today/count`, {
        withCredentials: true,
      });
      setTodayVisits(todayRes.data.totalTodayVisits || 0);
      // console.log(todayRes.data);
      

      // Total visits
      const totalRes = await axios.get(`${BASE_URL}/access/total/count`, {
        withCredentials: true,
      });
      setTotalVisits(totalRes.data.totalMemberVisits || 0);
      // console.log(totalRes.data);

      // Members list
      const membersRes = await axios.get(`${BASE_URL}/allUsers`, {
        withCredentials: true,
      });
      const members = membersRes.data.data || [];

      // 👉 SET MEMBER COUNTS FOR CHART
      setTotalMembers(members.length);

      const activeCount = members.filter(
        (m) =>
          m.subscription === "active" &&
          m.status !== "hold" &&
          m.status !== "lost"
      ).length;

      setActiveMembers(activeCount);

      // Manual bookings
      const manualRes = await axios.get(`${BASE_URL}/user/manual-bookings`, {
        withCredentials: true,
      });
      setManualBookings(manualRes.data.count || 0);

      // Online bookings
      const onlineRes = await axios.get(`${BASE_URL}/user/online-bookings`, {
        withCredentials: true,
      });
      setOnlineBookings(onlineRes.data.count || 0);

      // New members (last 7 days)
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
    <>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DashboardCard
            icon={<FaPlus />}
            title="Add Member"
            route="/adminDashboard/createMember"
          />
          <DashboardCard
            icon={<FaQuestion />}
            title="Online Enquiries"
            route="/onlineEnquiries"
          />
          <DashboardCard icon={<FaTasks />} title="Tasks" route="/tasks" />
          <DashboardCard
            icon={<HiOutlineQrCode />}
            title="Scan QR Code"
            route="/adminDashboard/scanQR"
          />
        </div>
      </section>

      {/* 🟦 STATS CARDS */}
      <section>
        <DashboardStats
          newMembers={newMembers}
          manualBookings={manualBookings}
          onlineBookings={onlineBookings}
          todayVisits={todayVisits}
          totalVisits={totalVisits}
        />
      </section>

      {/* 🟩 MEMBER + REVENUE CHARTS */}
      <section className="my-4 flex justify-between gap-6">
        {/* Member Chart  */}
        <MemberChart
          totalMembers={totalMembers}
          activeMembers={activeMembers}
          name="Members"
        />

        {/* Revenue Chart (placeholder — change when revenue backend ready) */}
        <MemberChart
          totalMembers={0}
          activeMembers={0}
          name="Revenue"
          color="#3851b5"
        />
      </section>
      <section>
        <CalendarFull/>
        {/* <CalendarView/> */}
      </section>
    </>
  );
};

export default AllDetails;
