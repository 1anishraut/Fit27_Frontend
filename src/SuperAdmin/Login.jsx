import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

import { addAdmin } from "../Utils/adminSlice";
import { addSuperAdmin } from "../Utils/superAdminSlice";
import { addUser } from "../Utils/userSlice"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    /* ------------------------------------------------------------------
       1️⃣ TRY SUPER ADMIN LOGIN
    ------------------------------------------------------------------ */
    try {
      const res = await axios.post(
        `${BASE_URL}/superAdmin/login`,
        { emailId, password },
        { withCredentials: true }
      );

      const user = res.data.data;

      localStorage.setItem("role", "superAdmin");
      dispatch(addSuperAdmin(user));

      return navigate("/superAdminDashboard/home");
    } catch (err) {
      // continue
    }

    /* ------------------------------------------------------------------
       2️⃣ TRY ADMIN LOGIN
    ------------------------------------------------------------------ */
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/login`,
        { emailId, password },
        { withCredentials: true }
      );

      const admin = res.data.data;

      localStorage.setItem("role", "admin");
      dispatch(addAdmin(admin));

      return navigate("/adminDashboard/allDetails");
    } catch (err) {
      // continue
    }

    /* ------------------------------------------------------------------
       3️⃣ TRY USER LOGIN
    ------------------------------------------------------------------ */
    
    try {
      const res = await axios.post(
        `${BASE_URL}/user/login`,
        { emailId, password },
        { withCredentials: true }
      );

      const user = res.data.data;

      localStorage.setItem("role", "user");
      dispatch(addUser(user));

      return navigate("/userDashboard/userAllDetails");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center font-robotoLight">
      <div className="flex flex-col lg:flex-row gap-36 items-center h-full">
        <section className="relative md:h-[80%] flex flex-col items-center justify-center px-10 rounded-md border-gray-400 shadow-lg shadow-black/50 border">
          <div className="flex flex-col items-center">
            <div className="text-center mb-12">
              <h1 className="text-4xl mb-4">Login</h1>
              <p className="text-sm">Enter your credentials</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-96">
              <div className="flex flex-col">
                <label htmlFor="emailId" className="mb-2">
                  Email
                </label>
                <input
                  type="text"
                  id="emailId"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="bg-[#FC3200] text-white p-2 rounded hover:bg-[#fc3200cc] transition-all duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
