import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

const PlansSection = ({ onSelectPlan }) => {
  const { slug } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/public/plans/${slug}`);
      setPlans(res.data.data || []);
    } catch (error) {
      console.error("Failed to load plans", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading plans...</div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No plans available for this gym
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="text-gray-600 mt-2">
          Flexible memberships designed for your fitness goals
        </p>
      </div>

      {/* PLANS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition flex flex-col"
          >
            {/* PLAN HEADER */}
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.planName}
              </h3>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{plan.planPrice}
                </span>
                <span className="text-sm text-gray-500">
                  / {plan.billingPeriod}
                </span>
              </div>
            </div>

            {/* PLAN BODY */}
            <div className="p-6 space-y-3 text-sm text-gray-700 flex-1">
              {plan.planDescription && (
                <p className="text-gray-600">{plan.planDescription}</p>
              )}

              <ul className="space-y-2">
                {plan.classes && (
                  <li className="flex justify-between">
                    <span>Classes</span>
                    <span className="font-medium">{plan.classes}</span>
                  </li>
                )}

                {plan.guestPass && (
                  <li className="flex justify-between">
                    <span>Guest Passes</span>
                    <span className="font-medium">{plan.guestPass}</span>
                  </li>
                )}

                {plan.renewalFee && (
                  <li className="flex justify-between">
                    <span>Renewal Fee</span>
                    <span className="font-medium">₹{plan.renewalFee}</span>
                  </li>
                )}

                <li className="flex justify-between">
                  <span>Billing Type</span>
                  <span className="font-medium">{plan.billingPeriod}</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 border-t">
              <button
                onClick={() => onSelectPlan(plan)}
                className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlansSection;
