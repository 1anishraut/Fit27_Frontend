import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BASE_URL } from "../../Utils/Constants";

export default function CreateEmailTemplateModal({
  isOpen,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({
    emailType: "",
    subject: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.emailType.trim()) return alert("Enter email type");
    if (!form.subject.trim()) return alert("Enter subject");
    if (!form.content.trim()) return alert("Enter email content");

    const payload = {
      emailType: form.emailType,
      subject: form.subject,
      content: form.content, // HTML from Quill
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/email-template/create`, payload, {
        withCredentials: true,
      });

      alert("Email template created!");
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D0D0F] w-full max-w-[850px] rounded-xl shadow-xl p-6 relative max-h-[95vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <FiX size={22} className="text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold dark:text-white mb-4">
          Create Email Template
        </h2>

        <div className="space-y-4">
          {/* EMAIL TYPE */}
          <div>
            <label className="text-sm dark:text-gray-300 mb-1 block">
              Email Type*
            </label>
            <input
              type="text"
              value={form.emailType}
              onChange={(e) => setForm({ ...form, emailType: e.target.value })}
              placeholder="welcome_email, invoice_email, otp_email"
              className="w-full border p-2 rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
            />
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-sm dark:text-gray-300 mb-1 block">
              Subject*
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Enter subject..."
              className="w-full border p-2 rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
            />
          </div>

          {/* RICH TEXT EDITOR */}
          <div>
            <label className="text-sm dark:text-gray-300 mb-1 block">
              Email Content*
            </label>

            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                className="bg-white dark:bg-[#1f1f23] dark:text-gray-200"
                style={{
                  height: "180px", // ↓ REDUCED HEIGHT
                  width: "100%", // FULLY RESPONSIVE
                }}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg dark:text-gray-200"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
