// PlanCard.jsx
import React from "react";
import { FiEdit2, FiTrash, FiToggleLeft } from "react-icons/fi";
import clsx from "clsx";

/**
 * PlanCard
 * props:
 *  - title (string)
 *  - price (string)
 *  - duration (string)
 *  - features (array of {label, enabled})
 *  - onEdit, onDelete
 *  - active (bool)
 *  - showBadge (string) // e.g. "Free Plan", "Lifetime Plan"
 */
export default function PlanCard({
  title,
  price,
  duration = "Lifetime",
  features = [],
  onEdit = () => {},
  onDelete = () => {},
  active = false,
  showBadge,
}) {
  return (
    <div
      className={clsx(
        "relative rounded-2xl border p-6 shadow-sm bg-white dark:bg-[#0D0D0F] dark:border-[#1f1f23]",
        "flex flex-col justify-between min-h-[360px]"
      )}
    >
      {/* Badge */}
      {showBadge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-black text-white dark:bg-white dark:text-black px-4 py-1 rounded-full text-sm shadow">
            {showBadge}
          </span>
        </div>
      )}

      {/* Header price */}
      <div className="pt-6 mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {price}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              /{duration}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Free Trial Days : 0
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-300">
                Active
              </span>
              <div
                className={clsx(
                  "w-11 h-6 rounded-full relative transition",
                  active ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                )}
                aria-hidden
              >
                <span
                  className={clsx(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition",
                    active && "translate-x-5"
                  )}
                />
              </div>
            </label>
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
                    : "bg-red-50 text-red-500"
                )}
              >
                {f.enabled ? "+" : "—"}
              </span>
              <span
                className={
                  f.enabled
                    ? "text-gray-700 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                }
              >
                {f.label}
              </span>
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

        {/* small spacer */}
        <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          ID: 001
        </div>
      </div>
    </div>
  );
}
