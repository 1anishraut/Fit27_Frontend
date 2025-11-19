import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/Constants";

const CreatePlan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    planName: "",
    planPrice: "",
    planDescription: "",
  });

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

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL + "/plan/create", formData, {
        withCredentials: true,
      });
      console.log("plan created");
      
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" flex justify-center items-center  p-4 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Create New Plan</h2>

        {/* Plan Name */}
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

        {/* Plan Price */}
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

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">Description</label>
          <textarea
            name="planDescription"
            value={formData.planDescription}
            onChange={handleChange}
            rows="3"
            className="border px-3 py-2 rounded-lg focus:ring w-full"
          ></textarea>
        </div>

        {/* Buttons */}
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

export default CreatePlan;
