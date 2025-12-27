import React, { useEffect, useRef, useState } from "react";
import UserSignUpForm from "../client/SignUpComponent/SignUpForm";
import SignupNavbar from "./SignUpComponent/SignupNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import PlansSection from "./SignUpComponent/PlansSection";

const UserSignup = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const formRef = useRef(null);

  const fetchBrand = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/public/brand/${slug}`);
      setBrand(res.data.data);
    } catch (err) {
      alert("Invalid gym link");
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [slug]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);

    // smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div>
      <SignupNavbar brand={brand} />

      <PlansSection onSelectPlan={handleSelectPlan} />

      <div ref={formRef}>
        <UserSignUpForm selectedPlan={selectedPlan} />
      </div>
    </div>
  );
};

export default UserSignup;
