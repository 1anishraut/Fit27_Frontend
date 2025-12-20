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

  /* -----------------------------
     USER SEARCH STATE
  ----------------------------- */
  const [searchText, setSearchText] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  /* -----------------------------
     TARGET CHANGE
  ----------------------------- */
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
    setUserResults([]);
  };

  /* -----------------------------
     USER SEARCH (DEBOUNCED)
  ----------------------------- */
  useEffect(() => {
    if (targetType !== "USER") return;

    if (!searchText.trim()) {
      setUserResults([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await axios.get(
          `${BASE_URL}/admin/search/users?q=${searchText}`,
          { withCredentials: true }
        );
        setUserResults(res.data.data || []);
      } catch (err) {
        console.error("User search failed", err);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [searchText, targetType]);

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

    if (!targetType) {
      alert("Please select enquiry target");
      return;
    }

    if (targetType === "USER" && !form.user) {
      alert("Please select a user");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      if (targetType === "USER") {
        formData.append("user", form.user);
      }

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
        <h2 className="text-xl font-semibold mb-6">Create Admin Enquiry</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SUBJECT */}
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          {/* MESSAGE */}
          <textarea
            rows={5}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          {/* TARGET */}
          <select
            value={targetType}
            onChange={handleTargetChange}
            className="w-full px-4 py-3 rounded-lg border"
          >
            <option value="">Select Enquiry For</option>
            <option value="USER">User</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>

          {/* USER SEARCH */}
          {targetType === "USER" && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search user (name / email / ID)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
              />

              {searching && (
                <p className="text-xs text-gray-500 mt-1">Searching...</p>
              )}

              {userResults.length > 0 && (
                <div
                  className="absolute z-10 w-full bg-white dark:bg-[#1a1b22]
                  border rounded-lg mt-1 max-h-56 overflow-auto"
                >
                  {userResults.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => {
                        setForm({ ...form, user: u._id });
                        setSearchText(
                          `${u.firstName} ${u.surName} (${u.emailId})`
                        );
                        setUserResults([]);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#222]"
                    >
                      <p className="font-medium">
                        {u.firstName} {u.surName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {u.emailId} • {u.customUserId}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ATTACHMENTS */}
          <input type="file" multiple onChange={handleFileChange} />

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold bg-black text-white"
            >
              {loading ? "Submitting..." : "Create Enquiry"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
