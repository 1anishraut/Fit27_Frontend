import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { useNavigate } from "react-router-dom";

const CreatePlans = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    planName: "",
    planPrice: "",
    planDescription: "",
    renewalFee: "",
    classes: "",
    guestPass: "",
    billingPeriod: "Monthly",
    customPeriodType: null,
    customPeriodValue: "",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/plan/create`, formData, {
        withCredentials: true,
      });

      alert("Plan created successfully!");
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] min-h-screen transition-all">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create New Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Add all required membership plan details here.
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#0D0D0F] p-6 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
      >
        {/* PLAN NAME + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium dark:text-white">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              required
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-white">
              Plan Price (₹)
            </label>
            <input
              type="number"
              name="planPrice"
              value={formData.planPrice}
              onChange={handleChange}
              required
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium dark:text-white">
            Description
          </label>
          <textarea
            name="planDescription"
            value={formData.planDescription}
            onChange={handleChange}
            className="w-full mt-1 border p-2 rounded-md h-24 bg-white dark:bg-[#1A1A1C]
            text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            placeholder="Short description..."
          ></textarea>
        </div>

        {/* RENEWAL, CLASSES, GUEST PASS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-white">
              Renewal Fee
            </label>
            <input
              type="number"
              name="renewalFee"
              value={formData.renewalFee}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-white">
              Classes Included
            </label>
            <input
              type="number"
              name="classes"
              value={formData.classes}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-white">
              Guest Pass
            </label>
            <input
              type="number"
              name="guestPass"
              value={formData.guestPass}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* BILLING PERIOD */}
        <div className="mt-6 flex flex-col lg:flex-row items-center gap-4 ">
          <div className="lg:w-[30%] w-full">
            <label className="text-sm font-medium dark:text-white">
              Billing Period
            </label>
            <select
              name="billingPeriod"
              value={formData.billingPeriod}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
            text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          {/* CUSTOM BILLING FIELDS */}
          <div className="w-full">
            {formData.billingPeriod === "Custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Period Type */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Custom Period Type
                  </label>
                  <select
                    name="customPeriodType"
                    value={formData.customPeriodType}
                    onChange={handleChange}
                    className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
                text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select Type</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>

                {/* Custom Period Value */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Custom Period Value
                  </label>
                  <input
                    type="number"
                    name="customPeriodValue"
                    value={formData.customPeriodValue}
                    onChange={handleChange}
                    className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
                text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 dark:border-gray-700
            rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlans;
