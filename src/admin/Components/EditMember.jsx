// src/admin/EditMember.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const inputClass =
  "w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

const toInputDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export default function EditMember() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [plans, setPlans] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [existingAvatar, setExistingAvatar] = useState("");
  const [formData, setFormData] = useState(null);
  const [approving, setApproving] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ststus, setStatus]= useState("");

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/plan/active`, {
        withCredentials: true,
      });
      setPlans(res?.data?.data || []);
    } catch (err) {
      console.log("Failed to load plans", err);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/${id}`, {
        withCredentials: true,
      });

      const u = res?.data?.data;
      console.log(u);
      setStatus(u.status);
      
      if (!u) throw new Error("User not found");

      const normalized = {
        firstName: u.firstName || "",
        surName: u.surName || "",
        emailId: u.emailId || "",
        contact: u.contact ?? "",
        fullAddress: u.fullAddress || "",
        country: u.country || "",
        state: u.state || "",
        city: u.city || "",
        zip: u.zip || "",
        selectedPlan: u.selectedPlan?._id || "",
        bookingFrom: u.bookingFrom || "Manual Booking",
        specialNote: u.specialNote || "",
        startedAt: toInputDate(u.startedAt),
        endedAt: toInputDate(u.endedAt),
        approval: u.approval ?? false,

        // ⭐ NEW HOLD FIELDS
        holdStartDate: toInputDate(u.holdStartDate),
        holdEndDate: toInputDate(u.holdEndDate),
      };

      setOriginalData(normalized);
      setFormData(normalized);

      setExistingAvatar(u.avatar ? `${BASE_URL}${u.avatar}` : "");
    } catch (err) {
      console.log("User load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchUser();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Detect changed fields only
  const getChangedFields = () => {
    if (!formData || !originalData) return {};

    const changed = {};

    Object.keys(formData).forEach((key) => {
      const newVal = formData[key];
      const oldVal = originalData[key];

      if (newVal !== oldVal) {
        if (newVal === "" && key !== "selectedPlan") return;
        changed[key] = newVal;
      }
    });

    if (avatarFile) changed.avatar = avatarFile;

    return changed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changed = getChangedFields();

    if (Object.keys(changed).length === 0) {
      alert("No changes to update");
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(changed).forEach(([k, v]) => payload.append(k, v));

      const res = await axios.patch(
        `${BASE_URL}/user/updateById/${id}`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Member updated successfully");
        navigate(-1);
      }
    } catch (err) {
      console.error(err?.response?.data || err);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading || !formData)
    return (
      <div className="p-10 text-gray-800 dark:text-white">Loading user...</div>
    );

    const todayInputDate = () => {
      const d = new Date();

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

const handleApprovalToggle = async () => {
  const nextValue = !formData.approval;

  const confirmMsg = nextValue
    ? "Approve this member?"
    : "Revoke approval for this member?";

  if (!window.confirm(confirmMsg)) return;

  try {
    setApproving(true);

    await axios.patch(
      `${BASE_URL}/user/updateById/${id}`,
      { approval: nextValue },
      { withCredentials: true }
    );

    setFormData((prev) => ({
      ...prev,
      approval: nextValue,
    }));

    alert(nextValue ? "Member approved successfully" : "Approval revoked");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Approval update failed");
  } finally {
    setApproving(false);
  }
};


  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-4 dark:text-white">
          Edit Member
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL */}
            <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
              <h2 className="text-lg font-semibold dark:text-white">
                General Information
              </h2>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-2 mt-4">
                {/* MEMBER STATUS */}
                <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Member Status <span className="px-1"></span>
                  <span className="text-green-500 font-semibold uppercase">
                    {ststus}
                  </span>
                </h2>

                {/* HOLD END DATE */}
                {formData.holdEndDate && (
                  <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Hold Ending on <span className="px-1"></span>
                    <span className="text-red-500 font-semibold">
                      {new Date(formData.holdEndDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </h2>
                )}
                {/* Approval Toggle  */}
                {/* APPROVAL TOGGLE */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Approval
                  </span>

                  <button
                    type="button"
                    onClick={handleApprovalToggle}
                    disabled={approving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${formData.approval ? "bg-green-600" : "bg-gray-400"}
    `}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition
        ${formData.approval ? "translate-x-6" : "translate-x-1"}
      `}
                    />
                  </button>

                  <span
                    className={`text-xs font-semibold ${
                      formData.approval ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {formData.approval ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm dark:text-white">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm dark:text-white">Surname</label>
                  <input
                    name="surName"
                    value={formData.surName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm dark:text-white">Email</label>
                  <input
                    name="emailId"
                    value={formData.emailId}
                    disabled
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm dark:text-white">Phone</label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm dark:text-white">Plan</label>
                  <select
                    name="selectedPlan"
                    value={formData.selectedPlan}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">No Plan</option>
                    {plans.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.planName} — ₹{p.planPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm dark:text-white">
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

            {/* ADDRESS */}
            <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
              <h2 className="text-lg font-semibold dark:text-white">
                Billing Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Address"
                />
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Zip"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Country"
                />
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="State"
                />
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="City"
                />
              </div>
            </div>

            {/* DATES */}
            <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
              <h2 className="text-lg font-semibold dark:text-white">
                Plan Dates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* START DATE */}
                <div>
                  <label className="text-sm dark:text-white">Start Date</label>
                  <input
                    type="date"
                    name="startedAt"
                    value={formData.startedAt || ""}
                    disabled
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>

                {/* END DATE */}
                <div>
                  <label className="text-sm dark:text-white">End Date</label>
                  <input
                    type="date"
                    name="endedAt"
                    value={formData.endedAt || ""}
                    disabled
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>

                {/* FULL-WIDTH INFO NOTE */}
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">
                    Plan dates are auto-calculated and cannot be edited
                    manually.
                  </p>
                </div>

                {/* HOLD START */}
                <div>
                  <label className="text-sm dark:text-white">
                    Hold Start Date
                  </label>
                  <input
                    type="date"
                    name="holdStartDate"
                    value={formData.holdStartDate || ""}
                    min={todayInputDate()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        holdStartDate: value,
                        holdEndDate: value ? prev.holdEndDate : "",
                      }));
                    }}
                    className={inputClass}
                  />
                </div>

                {/* HOLD END */}
                <div>
                  <label className="text-sm dark:text-white">
                    Hold End Date
                  </label>
                  <input
                    type="date"
                    name="holdEndDate"
                    value={formData.holdEndDate || ""}
                    disabled={!formData.holdStartDate}
                    min={formData.holdStartDate || todayInputDate()}
                    onChange={handleChange}
                    className={`${inputClass} ${
                      !formData.holdStartDate
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Note: Hold dates automatically extend end date.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* AVATAR */}
            <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
              <h2 className="text-lg font-semibold dark:text-white">Avatar</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <div className="mt-4 flex justify-center">
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    className="w-32 h-32 rounded-full object-cover"
                    alt="avatar-preview"
                  />
                ) : existingAvatar ? (
                  <img
                    src={existingAvatar}
                    className="w-32 h-32 rounded-full object-cover"
                    alt="existing-avatar"
                  />
                ) : (
                  <p>No Avatar</p>
                )}
              </div>
            </div>
            {/* ⭐ PLAN DETAILS CARD */}
            {formData.selectedPlan && (
              <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
                <h2 className="text-lg font-semibold dark:text-white mb-3">
                  Plan Details
                </h2>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Plan Name:</span>{" "}
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.planName
                    }
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Billing Period:</span>{" "}
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.billingPeriod
                    }
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Price:</span> ₹
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.planPrice
                    }
                  </p>

                  {/* Custom Duration */}
                  {plans.find((p) => p._id === formData.selectedPlan)
                    ?.customPeriodValue && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Custom Duration:</span>{" "}
                      {
                        plans.find((p) => p._id === formData.selectedPlan)
                          ?.customPeriodValue
                      }{" "}
                      {
                        plans.find((p) => p._id === formData.selectedPlan)
                          ?.customPeriodType
                      }
                    </p>
                  )}

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Classes:</span>{" "}
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.classes
                    }
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Guest Pass:</span>{" "}
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.guestPass
                    }
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Description:</span>{" "}
                    {
                      plans.find((p) => p._id === formData.selectedPlan)
                        ?.planDescription
                    }
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Plan Status:</span>{" "}
                    {plans.find((p) => p._id === formData.selectedPlan)
                      ?.active ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* SPECIAL NOTE */}
            <div className="border p-6 rounded-xl bg-white dark:bg-[#0D0D0F]">
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
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
