import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function CreateFitnessHubsModel({ isOpen, onClose }) {
  const [companyName, setCompanyName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setCompanyName("");
    setEmailId("");
    setPassword("");
    setCPassword("");
    setError("");
  };

  const handleCreate = async () => {
    if (!companyName || !emailId || !password || !cPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== cPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/admin/create`,
        {
          gymName: companyName,
          emailId,
          password,
          role: "admin", // only required field
        },
        { withCredentials: true }
      );

      console.log("Created:", res.data);

      resetForm();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create admin";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Name*
            </label>
            <input
              type="text"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Email*
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 dark:text-white">
            Password*
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-600 dark:text-gray-300"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 dark:text-white">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              type={showCPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10 bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            />

            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
              className="absolute right-3 top-2 text-gray-600 dark:text-gray-300"
            >
              {showCPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-black dark:bg-white 
          text-white dark:text-black disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
