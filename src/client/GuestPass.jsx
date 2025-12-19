import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

const initialForm = {
  firstName: "",
  surName: "",
  emailId: "",
  contact: "",
  note: "",
};

export default function GuestPass() {
  const [form, setForm] = useState(initialForm);
  const [guestPasses, setGuestPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ----------------------------------
     FETCH MY GUEST PASSES
  ---------------------------------- */
  const fetchGuestPasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guestPass/my`, {
        withCredentials: true,
      });
      setGuestPasses(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGuestPasses();
  }, []);

  /* ----------------------------------
     INPUT CHANGE
  ---------------------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------------------------------
     CREATE GUEST PASS
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.firstName || !form.surName || !form.contact) {
      setError("First name, surname and contact are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/guestPass/create`, form, {
        withCredentials: true,
      });

      setSuccess("Guest pass request created");
      setForm(initialForm);
      fetchGuestPasses();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.statusCode ||
        err?.message;

      setError(backendMessage || "Failed to create guest pass");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-3 py-2 rounded-md text-sm bg-white dark:bg-[#14151c] " +
    "border border-gray-300 dark:border-gray-700 " +
    "text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

  return (
    <div className="w-full space-y-8">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Guest Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              First name
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Surname
            </label>
            <input
              name="surName"
              value={form.surName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Contact
            </label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Note
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="text-xs text-red-600 dark:text-red-400  px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-green-600 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-md px-3 py-2">
            {success}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-black text-white text-xs dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

     
      {/* ================= LIST ================= */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Created Guest Passes
        </h3>

        {guestPasses.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No guest passes created yet
          </p>
        )}

        {guestPasses.length > 0 && (
          <>
            {/* ---------- TABLE HEADER (DESKTOP ONLY) ---------- */}
            <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300 px-4 pb-2">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-3">Note</div>
              <div className="col-span-1 text-center">Status</div>
            </div>

            {/* ---------- ROWS ---------- */}
            <div className="space-y-3">
              {guestPasses.map((gp) => (
                <div
                  key={gp._id}
                  className="
              grid grid-cols-1 md:grid-cols-12 gap-3
              bg-gray-50 dark:bg-[#181920]
              border border-gray-200 dark:border-gray-700
              rounded-md px-4 py-3 text-sm
            "
                >
                  {/* NAME */}
                  <div className="md:col-span-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {gp.firstName} {gp.surName}
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div className="md:col-span-3">
                    <p className="md:hidden text-xs text-gray-500">Email</p>
                    <p className="text-gray-700 dark:text-gray-300 truncate">
                      {gp.emailId || "-"}
                    </p>
                  </div>

                  {/* CONTACT */}
                  <div className="md:col-span-2">
                    <p className="md:hidden text-xs text-gray-500">Contact</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {gp.contact || "-"}
                    </p>
                  </div>

                  {/* NOTE */}
                  <div className="md:col-span-3">
                    <p className="md:hidden text-xs text-gray-500">Note</p>
                    <p className="text-gray-600 dark:text-gray-400 truncate">
                      {gp.note || "-"}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="md:col-span-1 flex md:justify-center justify-end items-center">
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
