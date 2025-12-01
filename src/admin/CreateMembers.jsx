import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

const CreateMembers = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    contact: "",
    fullAddress: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    selectedPlan: "Free",
    bookingFrom: "Manual Booking",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/adminDashboard/allDetails");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(BASE_URL + "/user/signUp", formData);

      if (response.status === 201) {
        alert("User created successfully");
        navigate("/adminDashboard/allDetails");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create new
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Manage account information, change their subscription plan, and
            update billing information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFO */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                General information
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                Member information forms provide key data used to track who
                worked for the company, when, and in what positions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] 
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Surname
                  </label>
                  <input
                    name="surName"
                    value={formData.surName}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] 
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Email Address
                  </label>
                  <input
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Phone Number
                  </label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Status
                  </label>
                  <select
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  >
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Key Fob
                  </label>
                  <input
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* BILLING ADDRESS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Billing address
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                This information will be added to your invoice.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Address Line 1
                  </label>
                  <input
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Address Line 2
                  </label>
                  <input
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  >
                    <option>Select...</option>
                    <option>India</option>
                    <option>USA</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  >
                    <option>Select...</option>
                    <option>Assam</option>
                    <option>Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  >
                    <option>Select...</option>
                    <option>Guwahati</option>
                    <option>Mumbai</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium dark:text-white">
                  Postcode/Zip
                </label>
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                  type="text"
                />
              </div>
            </div>

            {/* SECURITY */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                Change password
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                      type="password"
                    />
                    <FaEyeSlash className="absolute right-3 top-3 text-gray-500 dark:text-gray-300" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F]
                      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                      type="password"
                    />
                    <FaEyeSlash className="absolute right-3 top-3 text-gray-500 dark:text-gray-300" />
                  </div>
                </div>
              </div>
              {/* MISMATCH WARNING */}
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Password and Confirm Password do not match
                  </p>
                )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Special note
              </h2>
              <textarea
                className="w-full border p-2 rounded-md h-32 mt-2 bg-white dark:bg-[#0D0D0F]
                text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                placeholder="Write here..."
              ></textarea>

              <button className="text-blue-600 dark:text-blue-400 text-sm mt-2">
                📩 Send Message
              </button>
            </div>

            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-300 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Avatar
              </h2>

              <div
                className="border border-dashed h-72 mt-4 flex flex-col items-center justify-center 
              rounded-md border-gray-400 dark:border-gray-600 bg-white dark:bg-[#0D0D0F]"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  className="w-10 opacity-60 mb-2"
                  alt=""
                />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Browse files
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  or drop files here to upload
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 border border-gray-300 dark:border-gray-700 
            rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMembers;
