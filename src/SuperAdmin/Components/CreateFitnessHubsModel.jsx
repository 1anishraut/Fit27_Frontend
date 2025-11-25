import { FiX } from "react-icons/fi";

export default function CreateFitnessHubsModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-[#0D0D0F] w-[480px] rounded-xl 
      shadow-lg p-6 border border-gray-300 dark:border-gray-700 transition"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">
            Create Company
          </h2>
          <FiX
            onClick={onClose}
            className="text-2xl cursor-pointer 
          text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Name*
            </label>
            <input
              type="text"
              placeholder="Enter Company Name"
              className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Email*
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium dark:text-white">
            Login is enable
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div
              className="w-10 h-5 bg-gray-300 dark:bg-gray-700 
            peer-checked:bg-black dark:peer-checked:bg-white rounded-full 
            peer transition-all"
            ></div>

            <span
              className="absolute left-1 top-1 w-3 h-3 bg-white dark:bg-black 
              rounded-full transition-all peer-checked:translate-x-5"
            ></span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 
            text-black dark:text-white"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-md bg-black dark:bg-white 
          text-white dark:text-black"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
