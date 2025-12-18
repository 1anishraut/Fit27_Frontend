import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function Enquiry() {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;

    try {
      await axios.delete(`${BASE_URL}/admin/delete/enquery/${id}`, {
        withCredentials: true,
      });
      fetchEnquiries();
    } catch (err) {
      alert("Failed to delete enquiry");
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
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            User Enquiries
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and respond to user queries
          </p>
        </div>

        {/* EMPTY */}
        {enquiries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No enquiries found
          </p>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div
                key={e._id}
                className="rounded-lg p-5
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-[#181920]
                  space-y-4
                  hover:shadow-sm transition"
              >
                {/* TOP ROW */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                      {e.subject}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {e.createdBy?.firstName} {e.createdBy?.surName} ·{" "}
                      {e.createdBy?.emailId}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        e.status === "replied"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                  >
                    {e.status === "replied" ? "Replied" : "Pending"}
                  </span>
                </div>

                {/* MESSAGE */}
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
                  {e.message}
                </p>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
                  {/* VIEW USER */}
                  <button
                    onClick={() =>
                      navigate(`/adminDashboard/editMember/${e.createdBy?._id}`)
                    }
                    className="px-5 py-2 rounded-lg text-xs
                      border border-gray-300 dark:border-gray-600
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-[#1f1f23] transition"
                  >
                    View User
                  </button>

                  {/* REPLY */}
                  <button
                    onClick={() =>
                      navigate(`/adminDashboard/replyEnquiry/${e._id}`)
                    }
                    className="px-5 py-2 rounded-lg text-xs
                      bg-black text-white
                      dark:bg-white dark:text-black
                      hover:opacity-90 transition"
                  >
                    Reply
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="px-5 py-2 rounded-lg text-xs
                      border border-red-300 text-red-500
                      hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
