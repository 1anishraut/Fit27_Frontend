import { useState } from "react";
import logo from "../assets/react.svg";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { addAdmin } from "../Utils/adminSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [managerId, setManagerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/admin/login",
        { managerId, password },
        { withCredentials: true }
      );
      dispatch(addAdmin(res?.data));
      navigate("/adminDashboard/allDetails");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full  h-screen flex items-center justify-center font-robotoLight  self-center ">
      <div className="flex flex-col lg:flex-row gap-36  items-center h-full">
       

        
        <section className="relative md:h-[80%] flex flex-col items-center justify-center px-10 rounded-md border-gray-400 shadow-lg shadow-black/50 border">
          <div className="flex flex-col items-center">
            <div className="text-center  mb-12">
              <h1 className="text-4xl mb-4">Admin Login</h1>
              <p className="text-sm">Enter your credentials</p>
            </div>
            <form
              onSubmit={adminLoginHandler}
              className="flex flex-col gap-4 w-96"
            >
              <div className="flex flex-col">
                <label htmlFor="managerId" className=" mb-2">
                  Admin ID
                </label>
                <input
                  type="text"
                  id="managerId"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className=" mb-2">
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

export default Login;
