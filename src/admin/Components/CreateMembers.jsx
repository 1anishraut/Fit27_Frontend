import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const CreateMembers = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [classesList, setClassesList] = useState([]);

  const [avatar, setAvatar] = useState(null);

  // ⭐ FIXED: unified selectedClasses (not "classes")
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
    selectedClasses: [], // ⭐ correct place
    bookingFrom: "Manual Booking",
    specialNote: "",
  });

  // ⭐ FIXED missing states
  const [showClassModal, setShowClassModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const inputClass =
    "w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

  /* --------------------------------------------------
        FETCH PLANS 
  -------------------------------------------------- */
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/plan/active`, {
        withCredentials: true,
      });

      setPlans(res?.data?.data || []);
    } catch (error) {
      console.log("Error fetching plans:", error);
    }
  };

  /* --------------------------------------------------
        FETCH ACTIVE CLASSES 
  -------------------------------------------------- */
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes/active`, {
        withCredentials: true,
      });

      setClassesList(res?.data?.data || []);
    } catch (error) {
      console.log("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchClasses();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  /* --------------------------------------------------
        HANDLE CLASS SELECTION
  -------------------------------------------------- */
  const handleClassCheckbox = (classId) => {
    setFormData((prev) => {
      const exists = prev.selectedClasses.includes(classId);

      return {
        ...prev,
        selectedClasses: exists
          ? prev.selectedClasses.filter((id) => id !== classId)
          : [...prev.selectedClasses, classId],
      };
    });
  };

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

    const subscriptionValue =
      formData.selectedPlan && formData.selectedPlan !== ""
        ? "active"
        : "inactive";

    try {
      const payload = new FormData();

      // Append simple fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "selectedClasses") {
          payload.append(key, value);
        }
      });

      // ⭐ Correctly append selected classes array
      formData.selectedClasses.forEach((classId) =>
        payload.append("selectedClasses[]", classId)
      );

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

  /* --------------------------------------------------
        UI
  -------------------------------------------------- */

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        {/* HEADER */}
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
                {/* Names */}
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
                    type="email"
                    className={inputClass}
                  />
                </div>

                {/* Contact */}
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

                {/* PLAN SELECT */}
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

                {/* BOOKING FROM */}
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

              {/* ASSIGN CLASSES */}
              <div className="border rounded-xl p-6 mt-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold dark:text-white">
                    Assign Classes
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowClassModal(!showClassModal)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    {showClassModal ? "Hide Classes" : "Browse Classes"}
                  </button>
                </div>

                {/* Selected List */}
                {formData.selectedClasses.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-[#1A1A1C] rounded-md">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                      Selected:
                    </h3>

                    <ul className="mt-2 space-y-1 text-gray-800 dark:text-gray-200">
                      {formData.selectedClasses.map((id) => {
                        const cls = classesList.find((c) => c._id === id);
                        return (
                          <li key={id}>
                            • {cls?.name} — ₹{cls?.cost}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Class Browser */}
                {showClassModal && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search classes..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className={`${inputClass} mb-3`}
                    />

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {classesList
                        .filter((cls) =>
                          cls.name
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                        )
                        .map((cls) => (
                          <label
                            key={cls._id}
                            className="flex items-center gap-3 p-3 rounded-lg border 
                               border-gray-200 dark:border-gray-700 
                               bg-gray-50 dark:bg-[#14151c] 
                               hover:bg-gray-200 dark:hover:bg-[#1A1A1A] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedClasses.includes(
                                cls._id
                              )}
                              onChange={() => handleClassCheckbox(cls._id)}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-900 dark:text-gray-200 text-sm">
                              {cls.name} — ₹{cls.cost}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
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
                    type="password"
                    className={inputClass}
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
                    type="password"
                    className={inputClass}
                  />
                </div>
              </div>

              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 text-sm">Passwords do not match</p>
                )}
            </div>
          </div>

          {/* RIGHT SIDE */}
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

        {/* FOOTER BUTTONS */}
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
