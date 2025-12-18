import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useParams } from "react-router-dom";
import { FiClock, FiUser, FiAlertCircle } from "react-icons/fi";
import { useSelector } from "react-redux";

const statusStyle = {
  CHECK_IN:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CHECK_OUT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DENIED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CheckInHistory() {

  const user = useSelector((state) => state.user);
  const  id = user._id
  console.log(user._id);
  

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/access/user/${id}`, {
        withCredentials: true,
      });
      setLogs(res.data.data || []);
      console.log(res.data.data);
      
    } catch (err) {
      console.error("Failed to load access logs", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading access history…
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Access History
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Complete check-in / access activity
        </p>
      </div>

      {/* EMPTY */}
      {logs.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No access history found
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="rounded-lg p-4
                bg-gray-50 dark:bg-[#181920]
                border border-gray-200 dark:border-gray-700
                hover:shadow-sm transition"
            >
              {/* TOP ROW */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyle[log.status]
                    }`}
                  >
                    {log.status.replace("_", " ")}
                  </span>

                  {/* TIME */}
                  <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <FiClock size={14} />
                    {new Date(log.dateTime).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* ADMIN */}
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <FiUser size={14} />
                  {log.grantedBy?.firstName} {log.grantedBy?.surName}
                </div>
              </div>

              {/* NOTE */}
              {log.note && (
                <div className="mt-3 flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FiAlertCircle className="mt-0.5 text-gray-400" />
                  <p>{log.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
