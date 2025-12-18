import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { useNavigate, useParams } from "react-router-dom";

export default function ReplyEnquiry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔍 Image preview
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchEnquiry();
  }, []);

  // ESC to close preview
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setPreviewImage(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const fetchEnquiry = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/get/enquery/${id}`, {
        withCredentials: true,
      });
      setEnquiry(res.data.data);
      setReply(res.data.data.reply || "");
    } catch (err) {
      alert("Failed to load enquiry");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!reply.trim()) {
      alert("Reply message is required");
      return;
    }

    try {
      setSending(true);
      await axios.patch(
        `${BASE_URL}/admin/reply/enquery/${id}`,
        { reply },
        { withCredentials: true }
      );
      navigate(-1);
    } catch {
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading || !enquiry) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* MAIN CONTAINER */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {/* HEADER */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Reply Enquiry
        </h2>

        {/* USER INFO */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            User
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {enquiry.createdBy.firstName} {enquiry.createdBy.surName} ·{" "}
            {enquiry.createdBy.emailId}
          </p>
        </div>

        {/* SUBJECT */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Subject
          </p>
          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
            {enquiry.subject}
          </p>
        </div>

        {/* MESSAGE */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Message
          </p>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
            {enquiry.message}
          </p>
        </div>

        {/* ATTACHMENTS */}
        {enquiry.attachments?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Attachments
            </p>
            <div className="flex gap-4 flex-wrap">
              {enquiry.attachments.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE_URL.replace("/api", "")}/${img}`}
                  alt="attachment"
                  onClick={() =>
                    setPreviewImage(`${BASE_URL.replace("/api", "")}/${img}`)
                  }
                  className="w-28 h-28 object-cover rounded-md
                    border border-gray-300 dark:border-gray-600
                    cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        )}

        {/* DIVIDER */}
        <div className="border-t border-gray-300 dark:border-gray-700 my-6" />

        {/* RESPONSE */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Response
          </label>
          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="
              w-full px-3 py-2 text-sm rounded-md
              bg-white dark:bg-[#14151c]
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
            "
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs rounded-lg
              border border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="px-5 py-2 text-xs rounded-lg
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>

      {/* 🔍 IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80
            flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setPreviewImage(null)}
              className="
                absolute -top-4 -right-4
                w-9 h-9 rounded-full
                bg-white text-black
                flex items-center justify-center
                text-lg font-bold shadow
              "
            >
              ×
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
