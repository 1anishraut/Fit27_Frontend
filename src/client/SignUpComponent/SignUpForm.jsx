import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600";

const UserSignupForm = ({ selectedPlan }) => {
  const { slug } = useParams(); // 🔥 GYM SLUG
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
    selectedPlan: "",
  });

  /* ---------------------------------------
     FETCH PLANS OF THIS GYM
  --------------------------------------- */
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/public/plans/${slug}`);

      setPlans(res.data.data || []);
    } catch (error) {
      alert("Gym not found or plans unavailable");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [slug]);

  /* ---------------------------------------
     HANDLERS
  --------------------------------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------------------------------
     SUBMIT SIGNUP
  --------------------------------------- */
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
  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        selectedPlan: selectedPlan._id,
      }));
    }
  }, [selectedPlan]);


  return (
    <div className="flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <input
          name="firstName"
          placeholder="First Name"
          className={inputClass}
          onChange={handleChange}
          required
        />

        <input
          name="surName"
          placeholder="Surname"
          className={inputClass}
          onChange={handleChange}
          required
        />

        <input
          name="emailId"
          type="email"
          placeholder="Email"
          className={inputClass}
          onChange={handleChange}
          required
        />

        <input
          name="contact"
          placeholder="Phone"
          className={inputClass}
          onChange={handleChange}
        />

        {/* GYM-SPECIFIC PLANS */}
        <select
          name="selectedPlan"
          className={inputClass}
          onChange={handleChange}
          value={formData.selectedPlan} // 🔥 important
        >
          <option value="">Select a plan</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.planName} — ₹{plan.planPrice}
            </option>
          ))}
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={inputClass}
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className={inputClass}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default UserSignupForm;
