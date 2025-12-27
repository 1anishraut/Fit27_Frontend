import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SignupNavbar = ({ brand, onPlansClick, onSignupClick }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {brand?.adminLogoLight ? (
              <img src={brand.adminLogoLight} className="h-10 w-auto" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {brand?.name?.[0] || "G"}
              </div>
            )}
            <span className="font-bold text-lg text-gray-900">
              {brand?.name || "Gym"}
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={onPlansClick}
              className="text-gray-700 hover:text-[#FF6900] transition-colors duration-200 font-medium"
            >
              Plans
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-[#FF6900] transition-colors duration-200 font-medium"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="bg-[#FF6900] text-white px-4 py-2 rounded-md hover:bg-[#F54900] shadow-md transition"
            >
              Sign Up
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700 hover:text-[#FF6900] transition"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 py-4 space-y-3 border-t border-gray-200 bg-white/90 backdrop-blur-sm shadow-lg">
          <button
            onClick={() => {
              onPlansClick();
              setOpen(false);
            }}
            className="block w-full text-left text-gray-800 hover:text-[#F54900] transition font-medium"
          >
            Plans
          </button>

          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="block w-full text-left text-gray-800 hover:text-[#FF6900] transition font-medium"
          >
            Login
          </button>

          <button
            onClick={() => {
              onSignupClick();
              setOpen(false);
            }}
            className="block w-full bg-[#FF6900] text-white px-4 py-2 rounded-md hover:bg-[#F54900] transition shadow-md"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default SignupNavbar;
