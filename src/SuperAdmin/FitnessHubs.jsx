import { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "./Components/CompanyCard";
import CreateFitnessHubsModel from "./Components/CreateFitnessHubsModel";
import { BASE_URL } from "../Utils/Constants";

export default function FitnessHubs() {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/all`, {
        withCredentials: true,
      });

      setAdmins(res.data.data || []);
    } catch (err) {
      console.log("Error fetching admins:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen transition-all">
      {/* GRID */}
      <div className="grid grid-cols-4 gap-6">
        {/* Loading skeleton */}
        {loading && (
          <div className="text-gray-500 dark:text-gray-300 col-span-4 text-center">
            Loading companies...
          </div>
        )}

        {/* Render admin cards */}
        {!loading &&
          admins.map((admin, index) => (
            <CompanyCard
              key={admin._id}
              plan={admin.plan?.duration || "No Plan Assigned"}
              name={admin.gymName || "— No Name —"}
              email={admin.emailId}
              date={new Date(admin.createdAt).toISOString().split("T")[0]}
              time={new Date(admin.createdAt).toLocaleTimeString()}
              stats={[0, 0, 0, 0]} // placeholder stats
            />
          ))}

        {/* Create Company Card */}
        <div
          onClick={() => setOpen(true)}
          className="border-2 border-gray-300 dark:border-gray-700 
          rounded-xl flex flex-col items-center justify-center cursor-pointer 
          hover:border-black dark:hover:border-white transition p-4 
          bg-white dark:bg-[#0D0D0F]"
        >
          <div
            className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black 
          flex items-center justify-center rounded-lg text-3xl"
          >
            +
          </div>
          <h3 className="font-medium mt-3 text-lg dark:text-white">
            Create Company
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click here to add new company
          </p>
        </div>
      </div>

      <CreateFitnessHubsModel
        isOpen={open}
        onClose={() => {
          setOpen(false);
          fetchAdmins(); // refresh list after creation
        }}
      />
    </div>
  );
}
