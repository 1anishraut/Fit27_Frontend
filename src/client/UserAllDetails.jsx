import React from "react";
import { useSelector } from "react-redux";

import CalendarFull from "../CalendarFull";
import DashboardCard from "../client/Components/Dashboard/DashboardCards";

/* ================= ICONS ================= */
import { HiOutlineIdentification } from "react-icons/hi";
import { FaRegQuestionCircle, FaCalendarPlus, FaTasks } from "react-icons/fa";

/* ======================================== */

const UserAllDetails = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      {/* ================= DASHBOARD CARDS ================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* MEMBER CARD */}
          <DashboardCard
            icon={<HiOutlineIdentification size={22} />}
            title="Member Card"
            route="/userDashboard/myCard"
          />

          {/* RAISE A QUERY */}
          <DashboardCard
            icon={<FaRegQuestionCircle size={20} />}
            title="Raise a Query"
            route="/user/support"
          />

          {/* BOOK NEW CLASS */}
          <DashboardCard
            icon={<FaCalendarPlus size={20} />}
            title="Book New Class"
            route="/userDashboard/bookClass"
          />

          {/* TASKS */}
          {/* <DashboardCard
            icon={<FaTasks size={20} />}
            title="Tasks"
            route="/user/tasks"
          /> */}
        </div>
      </section>

      {/* ================= CALENDAR ================= */}
      <CalendarFull />
    </>
  );
};

export default UserAllDetails;
