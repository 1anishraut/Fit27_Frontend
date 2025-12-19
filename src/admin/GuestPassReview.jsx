import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";

const GuestPassReview = () => {
  const [guestPasses, setGuestPasses] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // 🔎 FILTER STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEW");

  const navigate = useNavigate();

  /* ----------------------------------
     FETCH ALL GUEST PASSES (ADMIN)
  ---------------------------------- */
  const fetchGuestPasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guestPass/all`, {
        withCredentials: true,
      });
      setGuestPasses(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load guest pass requests");
    }
  };

  useEffect(() => {
    fetchGuestPasses();
  }, []);

  /* ----------------------------------
     UPDATE STATUS (GRANT / DENY)
  ---------------------------------- */
  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);

      await axios.patch(
        `${BASE_URL}/guestPass/update/${id}/status`,
        { status },
        { withCredentials: true }
      );

      fetchGuestPasses();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.statusCode ||
          "Failed to update guest pass status"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ----------------------------------
     FILTER + SORT (FRONTEND)
  ---------------------------------- */
  const filteredGuestPasses = useMemo(() => {
    let data = [...guestPasses];

    // 🔍 SEARCH BY USER CUSTOM ID
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (gp) =>
          gp.user?.customUserId &&
          gp.user.customUserId.toLowerCase().includes(q)
      );
    }

    // 🎯 STATUS FILTER
    if (statusFilter !== "ALL") {
      data = data.filter((gp) => gp.status === statusFilter);
    }

    // ⏱ SORT
    data.sort((a, b) => {
      if (sortOrder === "NEW") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return data;
  }, [guestPasses, search, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER + FILTERS ================= */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* LEFT: TITLE */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Guest Pass Requests
          </h2>

          {/* RIGHT: FILTERS */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search by User ID (e.g. FIT2025013)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-3 py-2 text-xs rounded-md
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#14151c]
          text-gray-800 dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40 px-3 py-2 text-xs rounded-md
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#14151c]
          text-gray-800 dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="GRANTED">Granted</option>
              <option value="DENIED">Denied</option>
            </select>

            {/* SORT */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full md:w-40 px-3 py-2 text-xs rounded-md
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#14151c]
          text-gray-800 dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="NEW">Newest First</option>
              <option value="OLD">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {filteredGuestPasses.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No guest pass requests found
          </p>
        )}

        {filteredGuestPasses.length > 0 && (
          <>
            {/* TABLE HEADER */}
            <div className="hidden md:grid grid-cols-12 gap-x-4 text-xs font-semibold text-gray-600 dark:text-gray-300 px-4 pb-3">
              <div className="col-span-3">Guest</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Note</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* ROWS */}
            <div className="space-y-3">
              {filteredGuestPasses.map((gp) => {
                const isProcessed = gp.status !== "PENDING";

                return (
                  <div
                    key={gp._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-center
                      bg-gray-50 dark:bg-[#181920]
                      border border-gray-200 dark:border-gray-700
                      rounded-lg px-4 py-4 text-sm"
                  >
                    {/* GUEST */}
                    <div className="md:col-span-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {gp.firstName} {gp.surName}
                      </p>
                      {gp.user && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Requested by{" "}
                          <span className="font-medium">
                            {gp.user.firstName} {gp.user.surName}
                          </span>{" "}
                          ({gp.user.customUserId})
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3 truncate">
                      {gp.emailId || "-"}
                    </div>

                    <div className="md:col-span-2">{gp.contact || "-"}</div>

                    <div className="md:col-span-2 truncate">
                      {gp.note || "-"}
                    </div>

                    <div className="md:col-span-1 flex md:justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gp.status === "GRANTED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : gp.status === "DENIED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {gp.status}
                      </span>
                    </div>

                    <div className="md:col-span-1 flex flex-wrap gap-2 md:justify-center">
                      <button
                        disabled={isProcessed || loadingId === gp._id}
                        onClick={() => updateStatus(gp._id, "GRANTED")}
                        className="px-3 py-1 text-xs rounded-md border border-green-500 text-green-600 disabled:opacity-40"
                      >
                        Grant
                      </button>

                      <button
                        disabled={isProcessed || loadingId === gp._id}
                        onClick={() => updateStatus(gp._id, "DENIED")}
                        className="px-3 py-1 text-xs rounded-md border border-red-500 text-red-600 disabled:opacity-40"
                      >
                        Deny
                      </button>

                      {gp.user && (
                        <button
                          onClick={() =>
                            navigate(
                              `/adminDashboard/editMember/${gp.user._id}`
                            )
                          }
                          className="px-3 py-1 text-xs rounded-md border border-gray-400"
                        >
                          View User
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestPassReview;
