import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Utils/Constants";
import { addClasses } from "../Utils/classesSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const dispatch = useDispatch();
  // const classesData = useSelector((state) => state.classes);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const toggleMenu = (id) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes/all`, {
        withCredentials: true,
      });

      dispatch(addClasses(res.data));
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/classes/${id}`, {
        withCredentials: true,
      });

      setClasses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Classes</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full relative">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-4">Class Name</th>
              <th className="py-2 px-4">Capacity</th>
              <th className="py-2 px-4">Remaining</th>
              <th className="py-2 px-4">Cost</th>
              <th className="py-2 px-4">Active</th>

              <th className="py-2 px-4 text-right border-r">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((plan) => (
              <tr key={plan._id} className="border-b hover:bg-gray-200 cursor-pointer">
                <td className="py-2 px-4">{plan.name}</td>
                <td className="py-2 px-4">{plan.capacity}</td>
                <td className="py-2 px-4">{plan.remainingCapacity}</td>
                <td className="py-2 px-4">₹{plan.cost}</td>

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
                            navigate(`/adminDashboard/editClass/${plan._id}`, {
                              state: { plan },
                            })
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {classes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No classes found.
                </td>
              </tr>
            )}

            <tr className="font-semibold">
              <td className="py-2 px-4">Total Classes</td>
              <td className="py-2 px-4">{classes.length}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;
