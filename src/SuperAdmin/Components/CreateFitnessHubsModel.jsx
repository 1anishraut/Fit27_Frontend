import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function CreateFitnessHubsModel({ isOpen, onClose }) {
  // ---------------------------------
  // ALL HOOKS MUST ALWAYS RUN
  // ---------------------------------
  const [companyName, setCompanyName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [planId, setPlanId] = useState("");
  const [plans, setPlans] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------------
  // FETCH PLANS — ALWAYS ALLOWED
  // ---------------------------------
  useEffect(() => {
    if (!isOpen) return; // safe conditional INSIDE effect

    const loadPlans = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/adminPlans`, {
          withCredentials: true,
        });
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to load plans:", err);
      }
    };

    loadPlans();
  }, [isOpen]);

  // ---------------------------------
  // EARLY RETURN AFTER HOOKS
  // ---------------------------------
  if (!isOpen) return null;

  const resetForm = () => {
    setCompanyName("");
    setEmailId("");
    setPassword("");
    setCPassword("");
    setPlanId("");
    setError("");
  };

  const handleCreate = async () => {
    if (!companyName || !emailId || !password || !cPassword || !planId) {
      setError("All fields including plan selection are required");
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
          planId,
          role: "admin",
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
        className="
      bg-white dark:bg-[#0D0D0F] 
      w-[520px] 
      rounded-xl shadow-xl 
      p-6 
      border border-gray-300 dark:border-gray-700 
      transition-all
    "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold dark:text-white">
            Create Company
          </h2>
          <FiX
            onClick={onClose}
            className="text-2xl cursor-pointer text-gray-700 dark:text-gray-300 hover:scale-110 transition"
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              GYM Name*
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="
            w-full border rounded-md px-3 py-2 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-black dark:focus:ring-white
            transition
          "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Email*
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="
            w-full border rounded-md px-3 py-2 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-black dark:focus:ring-white
            transition
          "
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Password*
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
            w-full border rounded-md px-3 py-2 pr-11
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-black dark:focus:ring-white
            transition
          "
            />
            <button
              type="button"
              className="
            absolute right-3 top-2.5 
            text-gray-500 dark:text-gray-300 
            hover:text-black dark:hover:text-white
            transition
          "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              type={showCPassword ? "text" : "password"}
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              className="
            w-full border rounded-md px-3 py-2 pr-11
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-black dark:focus:ring-white
            transition
          "
            />
            <button
              type="button"
              className="
            absolute right-3 top-2.5 
            text-gray-500 dark:text-gray-300 
            hover:text-black dark:hover:text-white
            transition
          "
              onClick={() => setShowCPassword(!showCPassword)}
            >
              {showCPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Plan Dropdown */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Select Plan*
          </label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="
          w-full border rounded-md px-3 py-2
          bg-white dark:bg-gray-800 
          border-gray-300 dark:border-gray-600 
          text-gray-800 dark:text-gray-200
          focus:ring-2 focus:ring-black dark:focus:ring-white
          transition
        "
          >
            <option value="">-- Select a Plan --</option>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — ₹{p.price} ({p.duration})
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-right">{error}</p>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
          px-4 py-2 rounded-md 
          bg-gray-200 dark:bg-gray-700 
          text-black dark:text-white 
          hover:bg-gray-300 dark:hover:bg-gray-600
          transition
        "
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="
          px-5 py-2 rounded-md 
          bg-black dark:bg-white 
          text-white dark:text-black 
          font-medium
          hover:bg-gray-900 dark:hover:bg-gray-200
          disabled:opacity-50
          transition
        "
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
