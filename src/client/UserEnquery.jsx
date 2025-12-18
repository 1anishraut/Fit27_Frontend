import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function UserEnquery() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/get/enqueries`, {
        withCredentials: true,
      });
      setEnquiries(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading enquiries…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* MAIN CONTAINER */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2
              className="font-semibold text-gray-900 dark:text-gray-100
              text-xl sm:text-2xl lg:text-3xl"
            >
              User Enquiries
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your submitted queries and responses
            </p>
          </div>

          <button
            onClick={() => navigate("/userDashboard/createUserEnquery")}
            className="px-6 sm:px-8 py-3 sm:py-4
              rounded-lg font-semibold
              text-sm sm:text-base
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90 transition"
          >
            + Create New
          </button>
        </div>

        {/* LIST */}
        {enquiries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No enquiries found
          </p>
        ) : (
          <div className="space-y-5">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="rounded-xl p-5
                  border border-gray-200 dark:border-gray-700
                  bg-gray-100 dark:bg-[#1a1b22]
                  hover:shadow-md transition"
              >
                {/* SUBJECT */}
                <div className="mb-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Subject
                  </p>
                  <h3
                    className="font-semibold text-gray-900 dark:text-gray-100
                    text-base sm:text-lg"
                  >
                    {enq.subject}
                  </h3>
                </div>

                {/* MESSAGE */}
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Message
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
                    {enq.message}
                  </p>
                </div>

                {/* ATTACHMENTS */}
                {Array.isArray(enq.attachments) &&
                  enq.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                        Attachments
                      </p>
                      <div className="flex gap-6 flex-wrap">
                        {enq.attachments.map((img, i) => (
                          <img
                            key={i}
                            src={`${BASE_URL.replace("/api", "")}/${img}`}
                            alt="attachment"
                            className="w-32 sm:w-40 h-40 rounded-lg object-cover
                              border border-gray-300 dark:border-gray-600
                              hover:scale-105 transition"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* DIVIDER */}
                <div className="border-t border-gray-300 dark:border-gray-700 my-4" />

                {/* RESPONSE */}
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    Response
                  </p>

                  <div
                    className="rounded-lg p-3
                      text-sm sm:text-base
                      bg-white dark:bg-[#14151c]
                      border border-gray-300 dark:border-gray-600
                      text-gray-600 dark:text-gray-300
                      min-h-[60px]"
                  >
                    {enq.reply?.trim() ? enq.reply : "No response yet"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
