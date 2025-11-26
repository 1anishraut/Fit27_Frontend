import React, { useEffect, useState } from "react";
import PlanCard from "./Components/PlanCard";
import CreatePlanModal from "./Components/CreatePlanModel";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

export default function ManagePlan() {
  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState([]);

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/plans`, {
        withCredentials: true,
      });
      setPlans(res.data.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // When new plan is created
  const handleCreate = (newPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
  };

  // When deleting plan
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await axios.delete(`${BASE_URL}/plans/delete/${id}`, {
        withCredentials: true,
      });

      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed.");
    }
  };

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white">
            Manage Plan
          </h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-md bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow"
        >
          +
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-6">
          {plans.map((p) => (
            <PlanCard
              key={p._id}
              id={p._id}
              name={p.name}
              price={p.price}
              duration={p.duration}
              maxUsers={p.maxUsers}
              maxCustomers={p.maxCustomers}
              maxVendors={p.maxVendors}
              storage={p.storage}
              description={p.description}
              trialEnable={p.trialEnable}
              status={p.status}
              onEdit={() => alert("Edit " + p._id)}
              onDelete={() => handleDelete(p._id)}
            />
          ))}
        </div>
      </div>

      <CreatePlanModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
