import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const CreateMembers = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [avatar, setAvatar] = useState(null);

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
    selectedPlan: "",
    bookingFrom: "Manual Booking",
    specialNote: "",
  });

  const inputClass =
    "w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

  /* --------------------------------------------------
        FETCH ONLY ACTIVE PLANS  
  -------------------------------------------------- */
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/plan/active`, {
        withCredentials: true,
      });

      const planList = res?.data?.data || [];
      setPlans(planList);
    } catch (error) {
      console.log("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  const handleCancel = () => navigate("/adminDashboard/allDetails");

  /* --------------------------------------------------
      SUBMIT
  -------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // AUTO SET SUBSCRIPTION BASED ON PLAN
    const subscriptionValue =
      formData.selectedPlan && formData.selectedPlan !== ""
        ? "active"
        : "inactive";

    try {
      const payload = new FormData();

      // Append normal fields
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      // Append subscription
      payload.append("subscription", subscriptionValue);

      if (avatar) payload.append("avatar", avatar);

      const res = await axios.post(`${BASE_URL}/user/signUp`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("Member created successfully");
        navigate("/adminDashboard/members");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  /* -------------------------------------------------- */

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create new member
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Fill out basic details, billing information & security settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFO */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                General information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>

                {/* ACTIVE PLANS */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Plan
                  </label>
                  <select
                    name="selectedPlan"
                    value={formData.selectedPlan}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.planName} — ₹{plan.planPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Booking From
                  </label>
                  <select
                    name="bookingFrom"
                    value={formData.bookingFrom}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Manual Booking">Manual Booking</option>
                    <option value="Online SignUp">Online SignUp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BILLING */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Billing address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Address Line
                  </label>
                  <input
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Zip
                  </label>
                  <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Country
                  </label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    State
                  </label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    City
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Password
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    type="password"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    type="password"
                  />
                </div>
              </div>

              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 text-sm">Passwords do not match</p>
                )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* SPECIAL NOTE */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Special Note
              </h2>
              <textarea
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                className={`${inputClass} h-32`}
              />
            </div>

            {/* AVATAR */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Avatar</h2>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-4"
              />

              <div className="mt-4 border border-dashed p-4 rounded-md flex justify-center">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    No file selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMembers;
