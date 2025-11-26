import React, { useEffect, useState } from "react";
import PlanCard from "./Components/PlanCard";
import CreatePlanModal from "./Components/CreatePlanModel";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

import { useDispatch, useSelector } from "react-redux";
import { addAdminPlans } from "../Utils/adminPlansSlice";

export default function ManagePlan() {
  const dispatch = useDispatch();

  const plans = useSelector((state) => state.adminPlan) || [];

  const [open, setOpen] = useState(false);

  /* ============================================================
        Fetch all plans
     ============================================================ */
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/adminPlans`, {
        withCredentials: true,
      });

      // Save in Redux
      dispatch(addAdminPlans(res.data.data));
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ============================================================
        When a new plan is created
     ============================================================ */
  const handleCreate = (newPlan) => {
    dispatch(addAdminPlans([newPlan, ...plans]));
  };

  /* ============================================================
        Delete Plan
     ============================================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await axios.delete(`${BASE_URL}/adminplans/delete/${id}`, {
        withCredentials: true,
      });

      const updatedPlans = plans.filter((p) => p._id !== id);

      dispatch(addAdminPlans(updatedPlans));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed.");
    }
  };

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Manage Plan</h1>

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
