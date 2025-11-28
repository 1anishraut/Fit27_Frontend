import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function EditCouponModal({
  isOpen,
  onClose,
  couponId,
  onUpdated,
}) {
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
  const [fetching, setFetching] = useState(false);

  /* ============================================================
        FETCH ALL COMPANIES
  ============================================================ */
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/all`, {
        withCredentials: true,
      });

      console.log("Companies:", res.data); // DEBUGGING
      setCompanies(res.data.data || []);
    } catch (err) {
      console.log("Company fetch error:", err);
    }
  };

  /* ============================================================
        FETCH SINGLE COUPON (PREFILL FORM)
  ============================================================ */
  const fetchCouponDetails = async () => {
    if (!couponId) return;

    try {
      setFetching(true);

      const res = await axios.get(`${BASE_URL}/coupon/${couponId}`, {
        withCredentials: true,
      });

      const c = res.data.data;

      setForm({
        name: c.name,
        amount: c.amount,
        code: c.code,
      });

      setDiscountType(c.discountType);
      setSelectedCompanies(c.companies || []);
    } catch (err) {
      console.log("Fetch coupon error:", err);
      alert("Failed to load coupon");
    } finally {
      setFetching(false);
    }
  };

  /* Load companies + coupon */
  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchCouponDetails();
    }
  }, [isOpen]);

  /* ============================================================
        TOGGLE SELECT COMPANY
  ============================================================ */
  const toggleCompany = (id) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredCompanies = companies.filter((c) => {
    const name = c.gymName || c.companyName || c.name || c.firstName || "";
    return name.toLowerCase().includes(companySearch.toLowerCase());
  });

  /* ============================================================
        UPDATE COUPON
  ============================================================ */
  const handleUpdate = async () => {
    if (!form.name.trim()) return alert("Enter coupon name");
    if (!form.amount) return alert("Enter discount amount");
    if (!form.code.trim()) return alert("Enter coupon code");
    if (selectedCompanies.length === 0)
      return alert("Select at least one company");

    const payload = {
      name: form.name,
      amount: Number(form.amount),
      code: form.code.trim().toUpperCase(),
      discountType,
      companies: selectedCompanies,
    };

    try {
      setLoading(true);

      await axios.put(`${BASE_URL}/coupon/update/${couponId}`, payload, {
        withCredentials: true,
      });

      alert("Coupon Updated Successfully!");
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D0D0F] w-[600px] rounded-xl shadow-xl p-6 relative max-h-[95vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <FiX size={22} className="text-gray-500 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-semibold dark:text-white mb-4">
          Edit Coupon
        </h2>

        {fetching ? (
          <p className="text-gray-400 text-center py-6">Loading...</p>
        ) : (
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
                />
              </div>
            </div>

            {/* Companies */}
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
                      {c.gymName || c.companyName || c.name}
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
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
