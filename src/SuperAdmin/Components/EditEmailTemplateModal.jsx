import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BASE_URL } from "../../Utils/Constants";

export default function EditEmailTemplateModal({
  isOpen,
  onClose,
  onUpdated,
  templateId,
}) {
  const [form, setForm] = useState({
    emailType: "",
    subject: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  /* =====================================================
      FETCH TEMPLATE DETAILS FOR EDIT
  ===================================================== */
  useEffect(() => {
    if (!templateId || !isOpen) return;

    const fetchTemplate = async () => {
      try {
        setFetching(true);
        const res = await axios.get(
          `${BASE_URL}/email-template/${templateId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data?.data) {
          setForm({
            emailType: res.data.data.emailType || "",
            subject: res.data.data.subject || "",
            content: res.data.data.content || "",
          });
        }
      } catch (err) {
        console.log("Failed to load template:", err);
        alert("Failed to load template");
      } finally {
        setFetching(false);
      }
    };

    fetchTemplate();
  }, [templateId, isOpen]);

  /* =====================================================
      UPDATE TEMPLATE
  ===================================================== */
  const handleUpdate = async () => {
    if (!form.emailType.trim()) return alert("Enter email type");
    if (!form.subject.trim()) return alert("Enter subject");
    if (!form.content.trim()) return alert("Enter email content");

    try {
      setLoading(true);

      await axios.put(`${BASE_URL}/email-template/update/${templateId}`, form, {
        withCredentials: true,
      });

      alert("Template updated successfully");
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to update template");
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
          Edit Email Template
        </h2>

        {/* LOADING STATE */}
        {fetching ? (
          <p className="text-center text-gray-500 dark:text-gray-300 py-10">
            Loading template...
          </p>
        ) : (
          <div className="space-y-4">
            {/* EMAIL TYPE */}
            <div>
              <label className="text-sm dark:text-gray-300 mb-1 block">
                Email Type*
              </label>
              <input
                type="text"
                value={form.emailType}
                onChange={(e) =>
                  setForm({ ...form, emailType: e.target.value })
                }
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
                className="w-full border p-2 rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
              />
            </div>

            {/* CONTENT */}
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
                  style={{ height: "180px", width: "100%" }}
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
                onClick={handleUpdate}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
