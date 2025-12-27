import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SignupNavbar from "./SignUpComponent/SignupNavbar";
import PlansSection from "./SignUpComponent/PlansSection";
import UserSignUpForm from "../client/SignUpComponent/SignUpForm";
import { BASE_URL } from "../Utils/Constants";
import HeroSection from "./SignUpComponent/HeroSection";

const UserSignup = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plansRef = useRef(null);
  const formRef = useRef(null);

  const fetchBrand = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/public/brand/${slug}`);
      setBrand(res.data.data);
    } catch {
      alert("Invalid gym link");
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [slug]);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setTimeout(scrollToForm, 100);
  };

  return (
    <div>
      <SignupNavbar
        brand={brand}
        onPlansClick={scrollToPlans}
        onSignupClick={scrollToForm}
      />
      <HeroSection onBecomeMember={scrollToForm} />

      <div ref={plansRef}>
        <PlansSection onSelectPlan={handleSelectPlan} />
      </div>

      <div ref={formRef}>
        <UserSignUpForm selectedPlan={selectedPlan} />
      </div>
    </div>
  );
};

export default UserSignup;
