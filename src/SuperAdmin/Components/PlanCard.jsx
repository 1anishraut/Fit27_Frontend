import React from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import clsx from "clsx";

export default function PlanCard({
  id,
  name,
  price,
  duration,
  maxUsers,
  maxCustomers,
  maxVendors,
  storage,
  description,
  trialEnable,
  status,
  onEdit = () => {},
  onDelete = () => {},
}) {
  // Build features list from schema
  const features = [
    {
      label: `Users: ${maxUsers === -1 ? "Unlimited" : maxUsers}`,
      enabled: true,
    },
    {
      label: `Customers: ${maxCustomers === -1 ? "Unlimited" : maxCustomers}`,
      enabled: true,
    },
    {
      label: `Vendors: ${maxVendors === -1 ? "Unlimited" : maxVendors}`,
      enabled: true,
    },
    { label: `Storage: ${storage} MB`, enabled: true },
    {
      label: `Trial Enabled: ${trialEnable ? "Yes" : "No"}`,
      enabled: trialEnable,
    },
  ];

  return (
    <div
      className={clsx(
        "relative rounded-2xl border p-6 shadow-sm bg-white dark:bg-[#0D0D0F] dark:border-[#1f1f23]",
        "flex flex-col justify-between min-h-[360px]"
      )}
    >
      {/* Badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span
          className={clsx(
            "px-4 py-1 rounded-full text-sm shadow",
            status === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          )}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Header */}
      <div className="pt-6 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              Rs {price}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              / {duration}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              {description || "No description added"}
            </div>
          </div>
        </div>
      </div>

      {/* Feature list */}
      <div className="mt-6 flex-1">
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          {features.map((f, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                className={clsx(
                  "inline-flex items-center justify-center w-8 h-8 rounded-md",
                  f.enabled
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {f.enabled ? "+" : "—"}
              </span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-100 text-emerald-800 hover:opacity-90"
        >
          <FiEdit2 />
          <span className="text-sm">Edit</span>
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-600 hover:opacity-90"
        >
          <FiTrash />
          <span className="text-sm">Delete</span>
        </button>

        <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          ID: {id.slice(-4)}
        </div>
      </div>
    </div>
  );
}
