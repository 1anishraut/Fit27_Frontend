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
    if (!window.confirm("Delete this enquiry?")) return;

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
    return <div className="p-6 text-sm text-gray-500">Loading enquiries…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          User Enquiries
        </h2>

        {enquiries.length === 0 ? (
          <p className="text-sm text-gray-500">No enquiries found</p>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div
                key={e._id}
                className="p-4 rounded-lg
                  bg-gray-100 dark:bg-[#1a1b22]
                  border border-gray-200 dark:border-gray-700"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {e.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {e.createdBy?.firstName} {e.createdBy?.surName} ·{" "}
                      {e.createdBy?.emailId}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        e.status === "replied"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {e.status}
                  </span>
                </div>

                {/* MESSAGE */}
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {e.message}
                </p>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() =>
                      navigate(`/adminDashboard/replyEnquiry/${e._id}`)
                    }
                    className="px-4 py-2 text-xs rounded-lg
                      bg-black text-white
                      dark:bg-white dark:text-black"
                  >
                    Reply
                  </button>

                  <button
                    onClick={() => handleDelete(e._id)}
                    className="px-4 py-2 text-xs rounded-lg
                      border border-red-400 text-red-500"
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
