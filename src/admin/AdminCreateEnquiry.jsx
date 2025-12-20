import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function AdminCreateEnquiry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    message: "",
    user: "",
    instructor: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     HANDLE INPUT CHANGE
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      // ensure only one target
      ...(name === "user" && value ? { instructor: "" } : {}),
      ...(name === "instructor" && value ? { user: "" } : {}),
    }));
  };

  /* -----------------------------
     FILE CHANGE
  ----------------------------- */
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  /* -----------------------------
     SUBMIT
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.message) {
      alert("Subject and message are required");
      return;
    }

    if (form.user && form.instructor) {
      alert("Select either User or Instructor, not both");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      if (form.user) formData.append("user", form.user);
      if (form.instructor) formData.append("instructor", form.instructor);

      attachments.forEach((file) => formData.append("attachments", file));

      await axios.post(`${BASE_URL}/admin/create/enquiry`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Enquiry created successfully");
      navigate("/admin/enquiries");
    } catch (err) {
      console.error(err);
      alert("Failed to create enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Create Admin Enquiry
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Send an enquiry to a user or instructor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border
                border-gray-300 dark:border-gray-600
                bg-white dark:bg-[#1a1b22]
                text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border
                border-gray-300 dark:border-gray-600
                bg-white dark:bg-[#1a1b22]
                text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* USER ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              User ID (optional)
            </label>
            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handleChange}
              placeholder="Paste USER ObjectId"
              className="w-full px-4 py-3 rounded-lg border
                border-gray-300 dark:border-gray-600
                bg-white dark:bg-[#1a1b22]
                text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* INSTRUCTOR ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Instructor ID (optional)
            </label>
            <input
              type="text"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="Paste INSTRUCTOR ObjectId"
              className="w-full px-4 py-3 rounded-lg border
                border-gray-300 dark:border-gray-600
                bg-white dark:bg-[#1a1b22]
                text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* ATTACHMENTS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Attachments (max 3)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-600 dark:text-gray-400"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold
                bg-black text-white dark:bg-white dark:text-black
                hover:opacity-90 transition"
            >
              {loading ? "Submitting..." : "Create Enquiry"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg font-semibold
                border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
