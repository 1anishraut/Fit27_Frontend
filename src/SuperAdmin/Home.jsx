import React from "react";
import StatsGrid from "./Components/StarGrid";
import EarningsChart from "./Components/EarningsChart";
import ExpriringSoon from "./Components/ExpiringSoon";
import Inactive_Total from "./Components/Inactive_Total";

const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <StatsGrid />
        <div className="flex gap-6">
          <ExpriringSoon />
          <EarningsChart />
        </div>
        <div className="flex ">
          <Inactive_Total/>

        </div>
      </div>
    </>
  );
};

export default Home;
