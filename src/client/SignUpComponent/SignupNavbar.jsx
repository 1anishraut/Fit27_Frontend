import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const SignupNavbar = ({ brand }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ================= BRAND ================= */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/signup/${slug}`)}
          >
            {brand?.adminLogoLight ? (
              <img
                src={brand.adminLogoLight}
                alt="Gym Logo"
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="h-9 w-9 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
                {brand?.name?.[0] || "G"}
              </div>
            )}

            <span className="font-semibold text-gray-900 text-lg">
              {brand?.name || "Gym"}
            </span>
          </div>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate(`/signup/${slug}`)}
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              Plans
            </button>

            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              Login
            </button>

            <button
              onClick={() => navigate(`/signup/${slug}`)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <button
            onClick={() => {
              navigate(`/signup/${slug}`);
              setOpen(false);
            }}
            className="block w-full text-left text-gray-700 hover:text-blue-600 text-sm"
          >
            Plans
          </button>

          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="block w-full text-left text-gray-700 hover:text-blue-600 text-sm"
          >
            Login
          </button>

          <button
            onClick={() => {
              navigate(`/signup/${slug}`);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default SignupNavbar;
