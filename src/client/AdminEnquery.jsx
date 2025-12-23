import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

export default function UserEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [replyMap, setReplyMap] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/get/enquiries`, {
        withCredentials: true,
      });
      setEnquiries(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEND REPLY ---------------- */
  const sendReply = async (id) => {
    const replyText = replyMap[id]?.trim();
    if (!replyText) return alert("Reply cannot be empty");

    try {
      setSendingId(id);

      await axios.patch(
        `${BASE_URL}/user/reply/enquiry/${id}`,
        { reply: replyText },
        { withCredentials: true }
      );

      setReplyMap((prev) => ({ ...prev, [id]: "" }));
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading enquiries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-500 dark:text-red-400">{error}</div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          My Enquiries
        </h2>

        {enquiries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No enquiries found
          </p>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div
                key={e._id}
                className="rounded-lg p-5 border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-[#181920] space-y-4"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {e.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        e.status === "replied"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                  >
                    {e.status}
                  </span>
                </div>

                {/* MESSAGE */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {e.message}
                  </p>
                </div>

                {/* ATTACHMENTS */}
                {Array.isArray(e.attachments) && e.attachments.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {e.attachments.map((file, i) => (
                        <a
                          key={i}
                          href={`${BASE_URL}${file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1 rounded bg-gray-200 dark:bg-[#2a2b33]
                          text-gray-800 dark:text-gray-200 hover:underline"
                        >
                          File {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADMIN REPLY */}
                {e.reply && (
                  <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Admin Reply</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {e.reply}
                    </p>
                  </div>
                )}

                {/* USER REPLY */}
                {e.status === "pending" && (
                  <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Write your reply..."
                      value={replyMap[e._id] || ""}
                      onChange={(ev) =>
                        setReplyMap((prev) => ({
                          ...prev,
                          [e._id]: ev.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700
                      bg-white dark:bg-[#14151c] px-3 py-2 text-sm
                      text-gray-900 dark:text-gray-100 focus:outline-none
                      focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={() => sendReply(e._id)}
                        disabled={sendingId === e._id}
                        className="px-4 py-2 rounded-lg text-xs
                        bg-black text-white dark:bg-white dark:text-black
                        hover:opacity-90 disabled:opacity-50"
                      >
                        {sendingId === e._id ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
