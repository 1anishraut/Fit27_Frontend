import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import DashboardCard from "../admin/Components/Dashboard/DashboardCards";
import { useNavigate } from "react-router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BASE_URL } from "../Utils/Constants";
import { useDispatch } from "react-redux";
import { addPlans } from "../Utils/plansSlice";
import { toast } from "react-toastify";

const AdminPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  /* =====================================================
      FETCH PLANS
  ===================================================== */
  const fetchPlans = async () => {
    try {
      const res = await axios.get(BASE_URL + "/plan/all", {
        withCredentials: true,
      });

      dispatch(addPlans(res.data));
      setPlans(res?.data?.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const toggleMenu = (id) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  /* =====================================================
      ⭐ TOGGLE ACTIVE STATUS
  ===================================================== */
  const toggleActive = async (plan) => {
    const newStatus = !plan.active;

    try {
      await axios.patch(
        `${BASE_URL}/plan/update/${plan._id}`,
        { active: newStatus },
        { withCredentials: true }
      );

      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, active: newStatus } : p))
      );

      toast.success(`Plan ${newStatus ? "Activated" : "Deactivated"}!`);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  /* =====================================================
      DELETE PLAN
  ===================================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await axios.delete(BASE_URL + `/plan/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Plan deleted successfully!");
      fetchPlans();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="px-6 py-4 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      {/* Add Plan Card */}
      <div className="w-full sm:w-1/3 md:w-1/4 mt-4">
        <DashboardCard
          icon={<FaPlus />}
          title="Add Plan"
          route="/adminDashboard/createPlan"
        />
      </div>

      {/* Page Container */}
      <div className="mt-6 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0D0D0F]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Plans
          </h1>
        </div>

        {/* Table */}
        <div className="overflow-visible">
          <table className="w-full border-collapse">
            {/* ================= TABLE HEADER ================= */}
            <thead>
              <tr className="text-sm border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 font-medium w-40 text-left">
                  Plan Name
                </th>
                <th className="py-3 px-4 font-medium w-24 text-center">
                  Price
                </th>
                <th className="py-3 px-4 font-medium w-64 text-left">
                  Description
                </th>
                <th className="py-3 px-4 font-medium w-24 text-center">
                  Active
                </th>
                <th className="py-3 px-4 font-medium w-20 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            {/* ================= TABLE BODY ================= */}
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="transition-all border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white w-40">
                    {plan.planName}
                  </td>

                  <td className="py-3 px-4 text-gray-900 dark:text-white text-center w-24">
                    ₹{plan.planPrice}
                  </td>

                  <td className="py-3 px-4 text-gray-900 dark:text-white w-64">
                    {plan.planDescription}
                  </td>

                  {/* ACTIVE TOGGLE */}
                  <td className="py-3 px-4 text-center w-24">
                    <label className="flex justify-center items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={plan.active}
                          onChange={() => toggleActive(plan)}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-5 rounded-full transition ${
                            plan.active ? "bg-green-600" : "bg-gray-600"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 w-3 h-3 rounded-full transition ${
                            plan.active
                              ? "translate-x-5 bg-white"
                              : "translate-x-0 bg-white"
                          }`}
                        ></div>
                      </div>
                    </label>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-right relative w-20">
                    <div className="inline-flex justify-end w-full">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-900 dark:text-white"
                        onClick={() => toggleMenu(plan._id)}
                      />
                    </div>

                    {menuOpenId === plan._id && (
                      <div className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-xl border z-[50] bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700">
                        <button
                          onClick={() =>
                            navigate(`/adminDashboard/editPlan/${plan._id}`, {
                              state: { plan },
                            })
                          }
                          className="block w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-xl"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-xl"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* NO DATA */}
              {plans.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 italic text-gray-600 dark:text-gray-300"
                  >
                    No plans found.
                  </td>
                </tr>
              )}

              {/* TOTAL ROW */}
              <tr className="font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                <td className="py-3 px-4">
                  Total Plans <span className="px-4">{plans.length}</span>
                </td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
