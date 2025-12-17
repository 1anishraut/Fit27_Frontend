import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { BASE_URL } from "../Utils/Constants";
import CancelBookingModal from "./Components/CancelBookingModal";

const BookedClass = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  const [filters, setFilters] = useState({
    className: "",
    date: "",
  });

  /* ----------------------------------
     FETCH BOOKED CLASSES FIXED
  ---------------------------------- */
  const fetchBookedClasses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/user/booking/booked-classes`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        const data = res.data.data || [];
        setBookings(data);
        setFiltered(data); // show immediately
      } else {
        setBookings([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load booked classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedClasses();
  }, []);

  /* ----------------------------------
     APPLY FILTERS
  ---------------------------------- */
  const applyFilters = () => {
    let list = [...bookings];

    if (filters.className.trim()) {
      const keyword = filters.className.toLowerCase();
      list = list.filter(
        (b) =>
          b.classId &&
          b.classId.name &&
          b.classId.name.toLowerCase().includes(keyword)
      );
    }

    if (filters.date) {
      list = list.filter((b) => b.date === filters.date);
    }

    setFiltered(list);
  };

  const clearFilters = () => {
    setFilters({ className: "", date: "" });
    setFiltered(bookings);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Booked Classes
        </h2>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Class name"
            value={filters.className}
            onChange={(e) =>
              setFilters({ ...filters, className: e.target.value })
            }
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] border-gray-300 dark:border-gray-600"
          />

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] border-gray-300 dark:border-gray-600"
          />

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-md bg-black text-white text-sm dark:bg-white dark:text-black"
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {loading && <p className="text-xs text-gray-500">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-500">No booked classes found</p>
        )}

        {/* TABLE HEADINGS */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-12 px-5 py-3 mb-3 rounded-lg bg-gray-50 dark:bg-[#15161c] border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            <div className="col-span-3">Class Name</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-3">Time</div>
            <div className="col-span-2">Instructor</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="grid grid-cols-12 items-center px-5 py-4 rounded-lg bg-gray-100 dark:bg-[#1a1b22] border border-gray-200 dark:border-gray-700"
            >
              <div className="col-span-3 font-semibold text-gray-900 dark:text-gray-100">
                {b.classId?.name || "—"}
              </div>

              <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">
                {dayjs(b.date).format("DD MMM YYYY")}
              </div>

              <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">
                {b.startedAt} – {b.endedAt}
              </div>

              <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
                {b.instructorId?.firstName || "—"}
              </div>

              <div className="col-span-1 text-right">
                <button
                  onClick={() => setCancelBookingId(b._id)}
                  className="text-red-600 text-sm border px-2 py-1 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cancelBookingId && (
        <CancelBookingModal
          bookingId={cancelBookingId}
          onClose={() => setCancelBookingId(null)}
          onSuccess={fetchBookedClasses}
        />
      )}
    </div>
  );
};

export default BookedClass;
