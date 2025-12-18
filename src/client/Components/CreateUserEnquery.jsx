import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function CreateUserEnquery() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([null, null, null]); // 🔑 fixed 3 slots
  const [loading, setLoading] = useState(false);

  // refs for hidden inputs
  const fileRefs = [useRef(), useRef(), useRef()];

  /* ----------------------------------
     HANDLE FILE PER BOX
  ---------------------------------- */
  const handleFileSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Each image must be under 1MB");
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);

    // allow re-selecting same file
    e.target.value = null;
  };

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const handleSubmit = async () => {
    if (!subject || !message) {
      alert("Subject and message are required");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);

    files.forEach((file) => {
      if (file) {
        formData.append("attachments", file);
      }
    });

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/user/create/enquery`, formData, {
        withCredentials: true,
      });

      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     CLEANUP PREVIEW URLS
  ---------------------------------- */
  useEffect(() => {
    return () => {
      files.forEach((file) => file && URL.revokeObjectURL(file));
    };
  }, [files]);

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6 ">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Create new enquiry
        </h2>

        {/* SUBJECT */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md
              bg-white dark:bg-[#14151c]
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* MESSAGE */}
        <div className="space-y-1 mt-4">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Message
          </label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md
              bg-white dark:bg-[#14151c]
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* ATTACHMENTS */}
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Attach screenshots (max 3, 1MB each. jpeg/png only){" "}
            <span className="text-white text-sm">(Optional)</span>
          </p>

          <div className="grid grid-cols-3 gap-15">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                {/* HIDDEN INPUT */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRefs[idx]}
                  className="hidden"
                  onChange={(e) => handleFileSelect(idx, e)}
                />

                {/* CLICKABLE BOX */}
                <div
                  onClick={() => fileRefs[idx].current.click()}
                  className="h-60 cursor-pointer rounded-md
                    border border-gray-300 dark:border-gray-600
                    bg-gray-100 dark:bg-[#1a1b22]
                    flex items-center justify-center
                    text-xs text-gray-400
                    hover:border-black dark:hover:border-white
                    transition"
                >
                  {files[idx] ? (
                    <img
                      src={URL.createObjectURL(files[idx])}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span>
                      Image {idx + 1}{" "}
                      <span className="text-white text-sm">(Optional)</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
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
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-xs rounded-lg
              bg-black text-white
              dark:bg-white dark:text-black
              disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
