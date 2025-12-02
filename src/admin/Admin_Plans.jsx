import React, { useEffect, useState } from "react";
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
            <thead>
              <tr className="text-sm border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 font-medium">Plan Name</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="transition-all border-b border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {plan.planName}
                  </td>

                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{plan.planPrice}
                  </td>

                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {plan.planDescription}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-right relative">
                    <div className="inline-flex justify-end w-full">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer text-gray-900 dark:text-white"
                        onClick={() => toggleMenu(plan._id)}
                      />
                    </div>

                    {/* DROPDOWN */}
                    {menuOpenId === plan._id && (
                      <div
                        className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-xl border z-[50]
                      bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700"
                      >
                        <button
                          onClick={() =>
                            navigate(`/adminDashboard/editPlan/${plan._id}`, {
                              state: { plan },
                            })
                          }
                          className="block w-full text-left px-4 py-2 
                          text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-xl"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="block w-full text-left px-4 py-2 
                          text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-xl"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 italic text-gray-600 dark:text-gray-300"
                  >
                    No plans found.
                  </td>
                </tr>
              )}

              {/* Total Row */}
              <tr className="font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                <td className="py-3 px-4">Total Plans</td>
                <td className="py-3 px-4">{plans.length || 0}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
