import React from "react";
import DashboardCard from "./Components/Dashboard/DashboardCards";
import { FaPlus } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { HiOutlineQrCode } from "react-icons/hi2";
import DashboardStats from "./Components/Dashboard/DashboardStates";
import MemberChart from "./Components/Dashboard/MemberChart";
// import QuickActions from "./Components/QuickActions";

const AllDetails = () => {
  return (
    <>
      <section className=" ">
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
            route="/scanQR"
          />
        </div>
      </section>
      <section className="">
        <DashboardStats />
      </section>
      <section className="m-4  flex justify-between gap-8">
        <MemberChart
          totalMembers={2}
          activeMembers={2}
          name={"Members"}
          color={"#29abe2"}
        />
        <MemberChart
          totalMembers={2}
          activeMembers={2}
          name={"Revenue"}
          color={"#3851b5"}
        />
      </section>
    </>
  );
};

export default AllDetails;
