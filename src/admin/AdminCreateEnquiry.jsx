import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function AdminCreateEnquiry() {
  const navigate = useNavigate();

  const [targetType, setTargetType] = useState(""); // USER | INSTRUCTOR

  const [form, setForm] = useState({
    subject: "",
    message: "",
    user: "",
    instructor: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ----------------------------- SEARCH STATES */
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  /* ----------------------------- TARGET CHANGE */
  const handleTargetChange = (e) => {
    const value = e.target.value;
    setTargetType(value);

    setForm({
      subject: form.subject,
      message: form.message,
      user: "",
      instructor: "",
    });

    setSearchText("");
    setResults([]);
  };

  /* ----------------------------- SEARCH */
  useEffect(() => {
    if (!searchText.trim() || !targetType) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);

        const url =
          targetType === "USER"
            ? `${BASE_URL}/admin/search/users?q=${searchText}`
            : `${BASE_URL}/admin/search/instructors?q=${searchText}`;

        const res = await axios.get(url, { withCredentials: true });
        setResults(res.data.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [searchText, targetType]);

  /* ----------------------------- FILE */
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  /* ----------------------------- SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.message) {
      alert("Subject and message are required");
      return;
    }

    if (!targetType) {
      alert("Please select enquiry target");
      return;
    }

    if (targetType === "USER" && !form.user) {
      alert("Please select a user");
      return;
    }

    if (targetType === "INSTRUCTOR" && !form.instructor) {
      alert("Please select an instructor");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      if (targetType === "USER") formData.append("user", form.user);
      if (targetType === "INSTRUCTOR")
        formData.append("instructor", form.instructor);

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

  /* ----------------------------- INPUT STYLES */
  const inputClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

  return (
    <div className="pb-10 text-sm">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6  mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Create Admin Enquiry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SUBJECT */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={inputClass}
              placeholder="Membership related enquiry"
              required
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputClass}
              placeholder="Write your message here..."
              required
            />
          </div>

          {/* TARGET */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enquiry For <span className="text-red-500">*</span>
            </label>
            <select
              value={targetType}
              onChange={handleTargetChange}
              className={inputClass}
            >
              <option value="">Select Target</option>
              <option value="USER">User</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </div>

          {/* SEARCH */}
          {targetType && (
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search {targetType.toLowerCase()}
              </label>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type name / email"
                className={inputClass}
              />

              {searching && (
                <p className="text-xs text-gray-500 mt-1">Searching…</p>
              )}

              {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1a1b22] border border-gray-200 dark:border-gray-700 rounded-lg max-h-56 overflow-auto">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        if (targetType === "USER") {
                          setForm({ ...form, user: item._id });
                        } else {
                          setForm({ ...form, instructor: item._id });
                        }

                        setSearchText(
                          `${item.firstName} ${item.surName} (${
                            item.emailId || item.contact
                          })`
                        );
                        setResults([]);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#222]"
                    >
                      <p className="text-sm font-medium">
                        {item.firstName} {item.surName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.emailId || item.contact}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ATTACHMENTS */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Attachments (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="text-xs text-gray-600 dark:text-gray-300"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Create Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
