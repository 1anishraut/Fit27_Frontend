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
      setGuestPasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGuestPasses();
  }, []);

  /* ----------------------------------
     HANDLE INPUT CHANGE
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
      setError(err?.response?.data?.message || "Failed to create guest pass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* ---------------- FORM ---------------- */}
      <form
        onSubmit={handleSubmit}
        className="border border-green-500 rounded-xl p-6 space-y-4 bg-black text-green-400"
      >
        <h2 className="text-lg font-semibold border border-green-500 rounded-lg px-4 py-2">
          Guest information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-transparent border border-green-500"
            />
          </div>

          <div>
            <label className="text-sm">Surname</label>
            <input
              name="surName"
              value={form.surName}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-transparent border border-green-500"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-transparent border border-green-500"
            />
          </div>

          <div>
            <label className="text-sm">Contact</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-transparent border border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 p-2 rounded bg-transparent border border-green-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-4 py-2 rounded border border-orange-500 text-orange-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded border border-green-500 text-green-400"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* ---------------- LIST ---------------- */}
      <div className="mt-8 border border-orange-500 rounded-xl p-6">
        <h3 className="text-orange-400 mb-4">Created Guest Passes</h3>

        {guestPasses.length === 0 && (
          <p className="text-gray-400 text-sm">No guest passes created</p>
        )}

        <div className="space-y-3">
          {guestPasses.map((gp) => (
            <div
              key={gp._id}
              className="flex justify-between items-center border border-gray-700 rounded p-3 text-sm"
            >
              <div>
                <p>
                  {gp.firstName} {gp.surName}
                </p>
                <p className="text-gray-400">{gp.contact}</p>
              </div>

              <span
                className={`px-3 py-1 rounded text-xs ${
                  gp.status === "GRANTED"
                    ? "bg-green-600"
                    : gp.status === "DENIED"
                    ? "bg-red-600"
                    : "bg-yellow-600"
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
