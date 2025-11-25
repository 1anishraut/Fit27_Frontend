// CreatePlanModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

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
    crm: false,
    project: false,
    hrm: false,
    account: false,
  });

  // ESC key close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (k) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: val }));
  };

  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      {/* MODAL CARD */}
      <div className="relative bg-white dark:bg-[#0D0D0F] w-full max-w-4xl rounded-xl shadow-xl border dark:border-[#1f1f23] p-6 mt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-[#0D0D0F] pb-2">
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

        {/* FORM */}
        <form onSubmit={submit}>
          {/* GRID INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* UPDATED DURATION OPTIONS */}
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

            {/* REMOVED MAXIMUM CLIENTS */}

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

          {/* DESCRIPTION */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              className="w-full border p-3 rounded-md bg-white dark:bg-gray-900 dark:border-gray-700"
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

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={form.crm}
                  onChange={handleChange("crm")}
                  className="toggle"
                />
                CRM
              </label>

              <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={form.project}
                  onChange={handleChange("project")}
                  className="toggle"
                />
                Project
              </label>

              <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={form.hrm}
                  onChange={handleChange("hrm")}
                  className="toggle"
                />
                HRM
              </label>

              <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={form.account}
                  onChange={handleChange("account")}
                  className="toggle"
                />
                Account
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
