import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants"; // adjust path as needed

export default function CreatePlanModal({
  isOpen,
  onClose,
  onCreate = () => {},
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "Lifetime",
    maxUsers: "",
    maxCustomers: "",
    maxVendors: "",
    storage: "",
    description: "",
    trialEnable: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ref = useRef();

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  // Handle form change
  const handleChange = (key) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // Submit
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        duration: form.duration,
        maxUsers: Number(form.maxUsers),
        maxCustomers: Number(form.maxCustomers),
        maxVendors: Number(form.maxVendors),
        storage: Number(form.storage),
        description: form.description,
        trialEnable: form.trialEnable,
      };

      const res = await axios.post(`${BASE_URL}/adminPlans/create`, payload, {
        withCredentials: true,
      });

      onCreate(res.data.data); // send data to parent if needed
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      setErrorMsg(
        error.response?.data?.message || "Failed to create plan. Try again."
      );
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal */}
      <form
        ref={ref}
        onSubmit={submit}
        className="
          relative z-10 bg-white dark:bg-[#0D0D0F] 
          w-full max-w-3xl rounded-xl shadow-xl 
          border dark:border-[#1f1f23] 
          p-6
          max-h-[90vh] 
          overflow-y-auto 
          scrollbar-none
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold dark:text-white">
            Create New Plan
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#111]"
          >
            <FiX className="text-2xl dark:text-gray-300" />
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="text-red-500 text-sm mb-3">{errorMsg}</div>
        )}

        {/* GRID FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Name*
            </label>
            <input
              value={form.name}
              onChange={handleChange("name")}
              required
              className="input"
              placeholder="Enter Plan Name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Price*
            </label>
            <input
              value={form.price}
              onChange={handleChange("price")}
              required
              className="input"
              placeholder="Enter Plan Price"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Duration*
            </label>
            <select
              value={form.duration}
              onChange={handleChange("duration")}
              className="input"
            >
              <option>Lifetime</option>
              <option>Monthly</option>
              <option>Quarterly (4 Months)</option>
              <option>Half Yearly</option>
              <option>Yearly</option>
            </select>
          </div>

          {/* Max Users */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Maximum Users*
            </label>
            <input
              value={form.maxUsers}
              onChange={handleChange("maxUsers")}
              required
              className="input"
              placeholder="Enter Maximum Users"
            />
            <div className="text-xs text-gray-400 mt-1">
              Note: "-1" for Unlimited
            </div>
          </div>

          {/* Max Customers */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Maximum Customers*
            </label>
            <input
              value={form.maxCustomers}
              onChange={handleChange("maxCustomers")}
              className="input"
              placeholder="Enter Maximum Customers"
            />
            <div className="text-xs text-gray-400 mt-1">
              Note: "-1" for Unlimited
            </div>
          </div>

          {/* Max Vendors */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Maximum Vendors*
            </label>
            <input
              value={form.maxVendors}
              onChange={handleChange("maxVendors")}
              className="input"
              placeholder="Enter Maximum Vendors"
            />
            <div className="text-xs text-gray-400 mt-1">
              Note: "-1" for Unlimited
            </div>
          </div>

          {/* Storage */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Storage Limit*
            </label>
            <div className="flex">
              <input
                value={form.storage}
                onChange={handleChange("storage")}
                className="input flex-1"
                placeholder="Maximum Storage Limit"
              />
              <div className="ml-2 inline-flex items-center px-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                MB
              </div>
            </div>
          </div>
        </div>

        {/* TEXTAREA */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            className="w-full border p-3 rounded-md 
              bg-white dark:bg-gray-900 dark:border-gray-700"
            rows={4}
            placeholder="Enter Description"
          />
        </div>

        {/* TOGGLES */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm dark:text-gray-200">
              Trial is enable (on/off)
            </label>
            <input
              type="checkbox"
              checked={form.trialEnable}
              onChange={handleChange("trialEnable")}
              className="toggle"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md 
            bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md 
            bg-black text-white dark:bg-white dark:text-black"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
