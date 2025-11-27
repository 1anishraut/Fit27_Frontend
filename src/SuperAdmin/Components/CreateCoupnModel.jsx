import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function CreateCouponModal({ isOpen, onClose, onCreated }) {
  const [discountType, setDiscountType] = useState("percentage");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);

  // Load companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/all`, {
        withCredentials: true,
      });
      setCompanies(res.data.data || []);
    } catch (err) {
      console.log("Company fetch error:", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCompanies();
  }, [isOpen]);

  // Toggle selected companies
  const toggleCompany = (id) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter((x) => x !== id));
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    (c.gymName || "").toLowerCase().includes(companySearch.toLowerCase())
  );

  // Submit form
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Enter coupon name");
    if (!form.amount) return alert("Enter discount amount");
    if (!form.code.trim()) return alert("Enter coupon code");
    if (selectedCompanies.length === 0)
      return alert("Select at least one company");

    const payload = {
      name: form.name,
      amount: Number(form.amount),
      discountType,
      code: form.code.trim().toUpperCase(),
      companies: selectedCompanies,
    };

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/coupon/create`, payload, {
        withCredentials: true,
      });

      alert("Coupon Created Successfully!");
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D0D0F] w-[600px] rounded-xl shadow-xl p-6 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <FiX size={22} className="text-gray-500 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-semibold dark:text-white mb-4">
          Create New Coupon
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Name*
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200"
              placeholder="Enter Name"
            />
          </div>

          {/* Discount Type + Amount */}
          <div className="grid grid-cols-2 gap-4">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                Discount Type*
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            {/* Dynamic Amount Field */}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                {discountType === "percentage"
                  ? "Percentage (%) *"
                  : "Amount (₹) *"}
              </label>

              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200"
                placeholder={
                  discountType === "percentage" ? "Enter %" : "Enter amount"
                }
              />
            </div>
          </div>

          {/* Companies Multi-Select */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Companies*
            </label>

            <div className="border rounded-lg p-2 dark:bg-[#1f1f23]">
              <input
                type="text"
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full mb-2 p-2 border rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
              />

              <div className="max-h-32 overflow-y-auto pr-1">
                {filteredCompanies.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(c._id)}
                      onChange={() => toggleCompany(c._id)}
                    />
                    {c.gymName}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Coupon Code*
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="Enter Coupon Code"
              className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg dark:text-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
