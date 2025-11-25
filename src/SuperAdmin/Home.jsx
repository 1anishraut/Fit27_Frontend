import React from "react";
import StatsGrid from "./Components/StarGrid";
import EarningsChart from "./Components/EarningsChart";
import ExpriringSoon from "./Components/ExpiringSoon";
import Inactive_Total from "./Components/Inactive_Total";
import { useOutletContext } from "react-router-dom";


const Home = ({}) => {
  const { theme } = useOutletContext();
  return (
    <>
      <div className="flex flex-col gap-6">
        <StatsGrid />
        <div className="flex gap-6">
          <ExpriringSoon theme={theme} />
          <EarningsChart theme={theme} />
        </div>
        <div className="flex ">
          <Inactive_Total theme={theme} />
        </div>
      </div>
    </>
  );
};

export default Home;
