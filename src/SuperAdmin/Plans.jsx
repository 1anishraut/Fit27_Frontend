// ManagePlan.jsx
import React, { useState } from "react";
import PlanCard from "./Components/PlanCard";
import CreatePlanModal from "./Components/CreatePlanModel";
// import heroImg from "/mnt/data/0b64f8fc-3c55-4521-9252-8d33076fd8b2.png";

export default function Plan() {
  const [open, setOpen] = useState(false);

  const plans = [
    {
      id: 1,
      showBadge: "Free Plan",
      price: "Rs0",
      duration: "Lifetime",
      title: "Free Plan",
      active: true,
      features: [
        { label: "5 Users", enabled: true },
        { label: "5 Customers", enabled: true },
        { label: "5 Vendors", enabled: true },
        { label: "5 Clients", enabled: true },
        { label: "1024 MB Storage", enabled: true },
        { label: "Enable Account", enabled: true },
        { label: "Enable CRM", enabled: true },
      ],
    },
    {
      id: 2,
      showBadge: "Lifetime Plan",
      price: "Rs150,000",
      duration: "Lifetime",
      title: "Lifetime Plan",
      active: false,
      features: [
        { label: "Unlimited Users", enabled: true },
        { label: "Unlimited Customers", enabled: true },
        { label: "Unlimited Vendors", enabled: true },
        { label: "Unlimited Clients", enabled: true },
        { label: "10000 MB Storage", enabled: true },
        { label: "Disable Account", enabled: false },
        { label: "Enable CRM", enabled: true },
        { label: "Enable HRM", enabled: true },
      ],
    },
  ];

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen">
      {/* heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white">
            Manage Plan
          </h1>
          {/* <div className="text-sm text-gray-500 dark:text-gray-400">
            Dashboard &nbsp;&gt;&nbsp; Plan
          </div> */}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-md bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow"
          >
            +
          </button>
        </div>
      </div>

      {/* hero + cards */}
      <div className="grid grid-cols-12 gap-6">
        

        <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-6">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              {...p}
              onEdit={() => alert("edit " + p.id)}
              onDelete={() => alert("delete " + p.id)}
            />
          ))}
        </div>
      </div>

      <CreatePlanModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreate={(data) => console.log("create", data)}
      />
    </div>
  );
}
