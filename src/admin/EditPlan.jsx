import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BASE_URL } from "../Utils/Constants";

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    planName: "",
    planPrice: "",
    planDescription: "",
  });

  // Prefill from state (if navigated from table)
  useEffect(() => {
    if (location.state?.plan) {
      const { planName, planPrice, planDescription } = location.state.plan;
      setFormData({
        planName: planName || "",
        planPrice: planPrice || "",
        planDescription: planDescription || "",
      });
    }
  }, [location.state]);

  // Fetch from backend (page refresh / direct visit)
  const fetchPlanById = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/plan/${id}`, {
        withCredentials: true,
      });

      setFormData({
        planName: res.data.planName,
        planPrice: res.data.planPrice,
        planDescription: res.data.planDescription,
      });
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    if (!location.state?.plan) {
      fetchPlanById();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      planName: "",
      planPrice: "",
      planDescription: "",
    });
  };

  const handleCancel = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/plan/update/${id}`, formData, {
        withCredentials: true,
      });

      alert("Plan updated successfully");
      navigate(-1);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Edit Plan</h2>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Plan Name</label>
          <input
            type="text"
            name="planName"
            value={formData.planName}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Plan Price</label>
          <input
            type="number"
            name="planPrice"
            value={formData.planPrice}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Description</label>
          <textarea
            name="planDescription"
            value={formData.planDescription}
            onChange={handleChange}
            rows="3"
            className="border px-3 py-2 rounded-lg focus:ring w-full"
          />
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500"
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan;
