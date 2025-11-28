import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function EditPlanModal({
  isOpen,
  onClose,
  planId,
  onUpdated = () => {},
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
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ==========================================================
      FETCH PLAN DETAILS
  ========================================================== */
  useEffect(() => {
    if (!planId || !isOpen) return;

    const loadPlan = async () => {
      try {
        setFetching(true);

        const res = await axios.get(`${BASE_URL}/adminPlans/${planId}`, {
          withCredentials: true,
        });

        const p = res.data?.data;

        setForm({
          name: p.name,
          price: p.price,
          duration: p.duration,
          maxUsers: p.maxUsers,
          maxCustomers: p.maxCustomers,
          maxVendors: p.maxVendors,
          storage: p.storage,
          description: p.description,
          trialEnable: p.trialEnable,
        });
      } catch (err) {
        console.log(err);
        alert("Failed to load plan");
      } finally {
        setFetching(false);
      }
    };

    loadPlan();
  }, [planId, isOpen]);

  /* Update handler */
  const setVal = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  /* ==========================================================
      UPDATE PLAN
  ========================================================== */
  const updatePlan = async (e) => {
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

      await axios.put(`${BASE_URL}/adminPlans/update/${planId}`, payload, {
        withCredentials: true,
      });

      onUpdated();
      onClose();
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to update plan. Try again."
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* MODAL (Scroll Removed) */}
      <form
        onSubmit={updatePlan}
        className="
          relative z-10 bg-white dark:bg-[#0D0D0F] 
          w-full max-w-3xl rounded-xl shadow-xl 
          border dark:border-[#1f1f23] 
          p-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold dark:text-white">Edit Plan</h3>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#111]"
          >
            <FiX className="text-2xl dark:text-gray-300" />
          </button>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="text-red-500 text-sm mb-3">{errorMsg}</div>
        )}

        {/* LOADING */}
        {fetching ? (
          <p className="text-center text-gray-400 py-10">Loading plan...</p>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Name*
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setVal("name", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Price*
                </label>
                <input
                  value={form.price}
                  onChange={(e) => setVal("price", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Duration*
                </label>
                <select
                  value={form.duration}
                  onChange={(e) => setVal("duration", e.target.value)}
                  className="inputl"
                >
                  <option className="text-black">Lifetime</option>
                  <option className="text-black">Monthly</option>
                  <option className="text-black">Quarterly (4 Months)</option>
                  <option className="text-black">Half Yearly</option>
                  <option className="text-black">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Max Users
                </label>
                <input
                  value={form.maxUsers}
                  onChange={(e) => setVal("maxUsers", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Max Customers
                </label>
                <input
                  value={form.maxCustomers}
                  onChange={(e) => setVal("maxCustomers", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Max Vendors
                </label>
                <input
                  value={form.maxVendors}
                  onChange={(e) => setVal("maxVendors", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Storage Limit
                </label>
                <div className="flex">
                  <input
                    value={form.storage}
                    onChange={(e) => setVal("storage", e.target.value)}
                    className="input flex-1"
                  />
                  <span className="ml-2 px-3 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center">
                    MB
                  </span>
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
                onChange={(e) => setVal("description", e.target.value)}
                className="w-full border p-3 rounded-md dark:bg-gray-900 dark:border-gray-700"
                rows={4}
              />
            </div>

            {/* TRIAL */}
            <div className="mt-6 flex items-center gap-3">
              <label className="text-sm dark:text-gray-200">
                Trial Enabled
              </label>
              <input
                type="checkbox"
                checked={form.trialEnable}
                onChange={(e) => setVal("trialEnable", e.target.checked)}
              />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
