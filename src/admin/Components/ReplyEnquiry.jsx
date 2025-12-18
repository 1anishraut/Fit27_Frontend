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

  useEffect(() => {
    fetchEnquiry();
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
      console.error(err);
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
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading || !enquiry) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Reply Enquiry
        </h2>

        {/* USER INFO */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          <strong>User:</strong> {enquiry.createdBy.firstName}{" "}
          {enquiry.createdBy.surName} ({enquiry.createdBy.emailId})
        </p>

        {/* SUBJECT */}
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-4">
          {enquiry.subject}
        </p>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {enquiry.message}
        </p>

        {/* ATTACHMENTS */}
        {enquiry.attachments?.length > 0 && (
          <div className="mt-4 flex gap-4 flex-wrap">
            {enquiry.attachments.map((img, i) => (
              <img
                key={i}
                src={`${BASE_URL.replace("/api", "")}/${img}`}
                alt="attachment"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* REPLY */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Response
          </label>
          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-md
              bg-white dark:bg-[#14151c]
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs rounded-lg
              border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 text-xs rounded-lg
              bg-black text-white
              dark:bg-white dark:text-black
              disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
