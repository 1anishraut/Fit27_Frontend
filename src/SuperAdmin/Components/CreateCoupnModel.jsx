import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function CreateCouponModal({ isOpen, onClose }) {
  const [discountType, setDiscountType] = useState("percentage");
  const [codeType, setCodeType] = useState("manual");

  const companies = [
    "Gold’s Gym",
    "Anytime Fitness",
    "Powerhouse Gym",
    "FitX Center",
  ];

  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const toggleCompany = (c) => {
    if (selectedCompanies.includes(c)) {
      setSelectedCompanies(selectedCompanies.filter((x) => x !== c));
    } else {
      setSelectedCompanies([...selectedCompanies, c]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D0D0F] w-[600px] rounded-xl shadow-xl p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <FiX size={22} className="text-gray-500 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-semibold dark:text-white mb-4">
          Create New Coupon
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Name*
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200 dark:border-gray-700"
              placeholder="Enter Name"
            />
          </div>

          {/* Discount Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                Discount Type*
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200 dark:border-gray-700"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            {/* Discount Amount */}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                Amount*
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200 dark:border-gray-700"
                placeholder="Enter Amount"
              />
            </div>
          </div>

          {/* Companies Multi Select */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Companies*
            </label>

            <div className="border rounded-lg p-2 dark:border-gray-700 dark:bg-[#1f1f23]">
              {companies.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(c)}
                    onChange={() => toggleCompany(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Code area */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Code*
            </label>

            <div className="flex gap-6 mb-2">
              <label className="flex items-center gap-2 dark:text-gray-300">
                <input
                  type="radio"
                  checked={codeType === "manual"}
                  onChange={() => setCodeType("manual")}
                />
                Manual
              </label>

              <label className="flex items-center gap-2 dark:text-gray-300">
                <input
                  type="radio"
                  checked={codeType === "auto"}
                  onChange={() => setCodeType("auto")}
                />
                Auto Generate
              </label>
            </div>

            {codeType === "manual" && (
              <input
                type="text"
                placeholder="Enter Code"
                className="w-full border rounded-lg p-2 dark:bg-[#1f1f23] dark:text-gray-200 dark:border-gray-700"
              />
            )}

            {codeType === "auto" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code will be generated automatically.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg dark:border-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
