import { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "./Components/CompanyCard";
import CreateFitnessHubsModel from "./Components/CreateFitnessHubsModel";
import { BASE_URL } from "../Utils/Constants";
import { FiSearch } from "react-icons/fi";
import GymPlanTable from "./Components/GymPlanTable";

export default function FitnessHubs() {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // NEW — Toggle table visibility
  const [showTable, setShowTable] = useState(true);

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/all`, {
        withCredentials: true,
      });

      setAdmins(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      console.log("Error fetching admins:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle active/inactive
  const handleToggle = async (id, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/active/${id}`,
        { active: newStatus },
        { withCredentials: true }
      );

      setAdmins((prev) =>
        prev.map((admin) =>
          admin._id === id ? { ...admin, active: newStatus } : admin
        )
      );
    } catch (err) {
      console.log("Toggle error:", err.response?.data || err);
      alert("Failed to update");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* --------------------------------------------
      SEARCH + SORT
  --------------------------------------------- */
  useEffect(() => {
    let data = [...admins];

    if (search.trim() !== "") {
      data = data.filter((a) =>
        (a.gymName || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === "newest")
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (sortOrder === "oldest")
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (sortOrder === "active-first")
      data.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));

    if (sortOrder === "inactive-first")
      data.sort((a, b) => (a.active ? 1 : 0) - (b.active ? 1 : 0));

    setFiltered(data);
  }, [search, sortOrder, admins]);

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen transition-all">
      {/* ===================== FILTER BAR ===================== */}
      <div className="flex items-center justify-between mb-6">
        {/* Search Box */}
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border 
              border-gray-300 dark:border-gray-700 
              bg-white dark:bg-[#0D0D0F] 
              text-gray-700 dark:text-gray-200 
              focus:outline-none"
          />
        </div>
        <div className="flex gap-6 justify-between items-center">
          {/* ===================== SHOW TABLE TOGGLE ===================== */}
          <div
            onClick={() => setShowTable(!showTable)}
            className="flex items-center cursor-pointer bg-gray-200 dark:bg-[#1f1f23] px-4 py-2 rounded-lg text-sm 
            text-gray-700 dark:text-gray-200 hover:opacity-80"
          >
            <span className="mr-2">
              {showTable ? "Hide Table" : "Show Table"}
            </span>
            <div
              className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                showTable ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-all ${
                  showTable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 rounded-lg border 
            border-gray-300 dark:border-gray-700 
            bg-white dark:bg-[#0D0D0F] text-gray-700 dark:text-gray-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="active-first">Active First</option>
            <option value="inactive-first">Inactive First</option>
          </select>
        </div>
      </div>

      {/* ===================== PLAN TABLE ===================== */}
      {showTable && (
        <GymPlanTable
          data={admins.map((admin) => ({
            gymName: admin.gymName,
            email: admin.emailId,
            plan: admin.plan,
            active: admin.active,
            planStartDate: admin.planStartDate,
            planEndDate: admin.planEndDate,
            createdAt: admin.createdAt,
          }))}
        />
      )}

      {/* ===================== GRID OF CARDS ===================== */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        {loading && (
          <div className="text-gray-500 dark:text-gray-300 col-span-4 text-center">
            Loading companies...
          </div>
        )}

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

        {/* Admin Cards */}
        {!loading &&
          filtered.map((admin) => (
            <CompanyCard
              key={admin._id}
              _id={admin._id}
              plan={admin.plan?.duration || "No Plan Assigned"}
              name={admin.gymName || "— No Name —"}
              email={admin.emailId}
              active={admin.active}
              onToggle={handleToggle}
              date={new Date(admin.createdAt).toISOString().split("T")[0]}
              time={new Date(admin.createdAt).toLocaleTimeString()}
              stats={[0, 0, 0, 0]}
            />
          ))}
      </div>

      <CreateFitnessHubsModel
        isOpen={open}
        onClose={() => {
          setOpen(false);
          fetchAdmins();
        }}
      />
    </div>
  );
}
