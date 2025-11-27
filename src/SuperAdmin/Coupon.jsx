import { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiPlus } from "react-icons/fi";
import { BASE_URL } from "../Utils/Constants";
import CreateCouponModal from "./Components/CreateCoupnModel";

export default function Coupon() {
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/coupon/all`, {
        withCredentials: true,
      });

      setCoupons(res.data.data || []);
    } catch (error) {
      console.log("Coupon fetch failed:", error);
    }
  };

  // Load on page open
  useEffect(() => {
    fetchCoupons();
  }, []);

  /* -----------------------------------------------
       FILTERING + SEARCHING (Frontend Only)
  ------------------------------------------------ */
  const filteredCoupons = coupons.filter((c) => {
    const query = search.toLowerCase().trim();

    return (
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.discountType.toLowerCase().includes(query)
    );
  });

  /* -----------------------------------------------
       PAGINATION
  ------------------------------------------------ */
  const paginatedCoupons = filteredCoupons.slice(0, rowsPerPage);

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0D0D0F] p-4 rounded-xl shadow flex justify-between items-center">
        {/* Entries Per Page */}
        <div className="flex items-center gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border px-3 py-2 rounded-lg dark:bg-[#1f1f23] dark:border-gray-700 dark:text-gray-200 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span className="text-gray-600 dark:text-gray-400">
            entries per page
          </span>
        </div>

        <div className="flex-1"></div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-[#1f1f23] dark:border-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white dark:bg-[#0D0D0F] rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-[#1f1f23] text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">NAME</th>
              <th className="p-3 text-left">CODE</th>
              <th className="p-3 text-left">DISCOUNT</th>
              <th className="p-3 text-left">USED</th>
              <th className="p-3 text-left">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCoupons.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500 dark:text-gray-400"
                >
                  No entries found
                </td>
              </tr>
            ) : (
              paginatedCoupons.map((c) => (
                <tr key={c._id} className="border-b dark:border-gray-700">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.code}</td>

                  <td className="p-3">
                    {c.discountType === "percentage"
                      ? `${c.amount}%`
                      : `₹${c.amount}`}
                  </td>

                  <td className="p-3">{c.used}</td>

                  <td className="p-3">Action</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateCouponModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={fetchCoupons} // auto refresh
      />
    </div>
  );
}
