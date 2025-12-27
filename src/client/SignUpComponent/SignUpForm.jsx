import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const inputClass =
  "w-full rounded-lg border border-white/30 bg-white/80 backdrop-blur px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const UserSignupForm = ({ selectedPlan }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    contact: "",
    fullAddress: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    selectedPlan: "",
  });

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/public/plans/${slug}`);
        setPlans(res.data?.data || []);
      } catch {
        alert("Failed to load plans");
      }
    };
    fetchPlans();
  }, [slug]);

  /* ---------------- PRESELECT PLAN ---------------- */
  useEffect(() => {
    if (selectedPlan?._id) {
      setFormData((prev) => ({ ...prev, selectedPlan: selectedPlan._id }));
    }
  }, [selectedPlan]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/public/signup/${slug}`, formData);
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 bg-cover bg-center px-4 py-10 relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1558611848-73f7eb4001a1)",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-white/20 backdrop-blur-2xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-4 text-white rounded-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Join the Fitness Revolution
        </h1>
        <p className="text-center text-xs sm:text-sm text-gray-200 mb-4">
          Create your account and start your journey today
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            className={inputClass}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="surName"
            placeholder="Surname"
            className={inputClass}
            value={formData.surName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="emailId"
          type="email"
          placeholder="Email"
          className={inputClass}
          value={formData.emailId}
          onChange={handleChange}
          required
        />
        <input
          name="contact"
          placeholder="Phone"
          className={inputClass}
          value={formData.contact}
          onChange={handleChange}
        />

        <select
          name="selectedPlan"
          className={inputClass}
          value={formData.selectedPlan}
          onChange={handleChange}
        >
          <option value="">Select a plan</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.planName} — ₹{plan.planPrice}
            </option>
          ))}
        </select>

        <input
          name="fullAddress"
          placeholder="Full Address"
          className={inputClass}
          value={formData.fullAddress}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            name="country"
            placeholder="Country"
            className={inputClass}
            value={formData.country}
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            className={inputClass}
            value={formData.state}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            className={inputClass}
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <input
          name="zip"
          placeholder="Zip"
          className={inputClass}
          value={formData.zip}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="password"
            type="password"
            placeholder="Password"
            className={inputClass}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={inputClass}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3 mt-4 rounded-lg bg-[#FF6900] hover:bg-[#F54900] transition font-semibold shadow-lg text-sm sm:text-base"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* RIGHT PROMO — hidden on mobile */}
      <div className="hidden lg:flex relative z-10 max-w-lg p-12 flex-col justify-center text-white">
        <h1 className="opacity-90 text-4xl xl:text-6xl font-extrabold leading-tight mb-4 uppercase">
          Register now <br /> to get more deals
        </h1>
        <p className="text-base xl:text-lg font-medium opacity-80">
          Where health, beauty and fitness meet. <br /> Join today and unlock
          exclusive offers, premium workouts and personal coaching.
        </p>

        <ul className="mt-6 space-y-3 text-sm font-medium opacity-70">
          <li>✔ Access to premium workouts</li>
          <li>✔ Expert trainers & diet plans</li>
          <li>✔ Flexible membership plans</li>
          <li>✔ Cancel anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default UserSignupForm;
