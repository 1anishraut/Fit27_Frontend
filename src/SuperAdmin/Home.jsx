import React from "react";
import StatsGrid from "./Components/StarGrid";
import EarningsChart from "./Components/EarningsChart";
import ExpriringSoon from "./Components/ExpiringSoon";

const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <StatsGrid />
        <div className="flex gap-6">
          <ExpriringSoon />
          <EarningsChart />
        </div>
        <div className="flex border border-red-500">
          

        </div>
      </div>
    </>
  );
};

export default Home;
