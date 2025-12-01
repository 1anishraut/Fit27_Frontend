import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import DashboardCard from "../admin/Components/Dashboard/DashboardCards";
import { useNavigate } from "react-router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BASE_URL } from "../Utils/Constants";
import { useDispatch } from "react-redux";
import { addPlans } from "../Utils/plansSlice";

const AdminPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(BASE_URL + "/plan/all", {
        withCredentials: true,
      });
      dispatch(addPlans(res.data));
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Toggle dropdown
  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  // Delete plan
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
    <div>
      <div className="px-6"> 

      <div className="w-1/4 mt-4">
        <DashboardCard
          icon={<FaPlus />}
          title="Add Plan"
          route="/adminDashboard/createPlan"
        />
      </div>
      </div>

      <div className="p-6 min-h-screen ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">All Plans</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full relative">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-4">Plan Name</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{plan.planName}</td>
                  <td className="py-2 px-4">₹{plan.planPrice}</td>
                  <td className="py-2 px-4">{plan.planDescription}</td>

                  {/* Actions Column */}
                  <td className="py-2 px-4 relative text-right">
                    <div className="inline-block relative">
                      <BsThreeDotsVertical
                        className="text-xl cursor-pointer"
                        onClick={() => toggleMenu(plan._id)}
                      />

                      {menuOpenId === plan._id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-32 border z-20">
                          <button
                            onClick={() =>
                              navigate(`/adminDashboard/editPlan/${plan._id}`, {
                                state: { plan },
                              })
                            }
                            className="block w-full text-left px-4 py-2 "
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="block w-full text-left px-4 py-2  text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No plans found.
                  </td>
                </tr>
              )}

              {/* Total Count Row */}
              <tr className=" font-semibold">
                <td className="py-2 px-4">Total Plans</td>
                <td className="py-2 px-4">{plans.length || 0}</td>
                <td className="py-2 px-4" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
