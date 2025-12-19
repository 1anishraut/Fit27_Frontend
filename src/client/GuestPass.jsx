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
      // ✅ FIXED: show backend ApiError message
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.statusCode ||
        err?.message;

      setError(backendMessage || "Failed to create guest pass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-green-400">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0d0f] border border-green-600 rounded-2xl p-6 space-y-5 shadow-lg"
      >
        <div className="border border-green-600 rounded-lg px-4 py-2">
          <h2 className="text-lg font-semibold tracking-wide">
            Guest information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-green-300">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md bg-transparent border border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm text-green-300">Surname</label>
            <input
              name="surName"
              value={form.surName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md bg-transparent border border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm text-green-300">Email</label>
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md bg-transparent border border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm text-green-300">Contact</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md bg-transparent border border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-green-300">Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 px-3 py-2 rounded-md bg-transparent border border-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* MESSAGES */}
        {error && (
          <p className="text-sm text-red-400 border border-red-500/40 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-400 border border-green-500/40 rounded-md px-3 py-2">
            {success}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-4 py-2 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md border border-green-600 text-green-400 hover:bg-green-600/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="mt-8 bg-[#0b0d0f] border border-orange-500 rounded-2xl p-6">
        <h3 className="text-orange-400 mb-4 tracking-wide">
          Created Guest Passes
        </h3>

        {guestPasses.length === 0 && (
          <p className="text-sm text-gray-400">No guest passes created yet</p>
        )}

        <div className="space-y-3">
          {guestPasses.map((gp) => (
            <div
              key={gp._id}
              className="flex justify-between items-center border border-gray-700 rounded-lg px-4 py-3 text-sm"
            >
              <div>
                <p className="text-green-300 font-medium">
                  {gp.firstName} {gp.surName}
                </p>
                <p className="text-gray-400 text-xs">{gp.contact}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  gp.status === "GRANTED"
                    ? "bg-green-600/80 text-white"
                    : gp.status === "DENIED"
                    ? "bg-red-600/80 text-white"
                    : "bg-yellow-500/80 text-black"
                }`}
              >
                {gp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
