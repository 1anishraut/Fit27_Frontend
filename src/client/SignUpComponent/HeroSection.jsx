import React from "react";

const HeroSection = ({ onBecomeMember }) => {
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl px-4">
        <p className="uppercase tracking-widest text-sm text-gray-300 mb-4">
          Work harder, get stronger
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Easy With Our <span className="text-orange-500">Gym</span>
        </h1>

        <button
          onClick={onBecomeMember}
          className="mt-4 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition"
        >
          Become a Member
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
