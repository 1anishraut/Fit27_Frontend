import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

export default function EmailSettings() {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const [form, setForm] = useState({
    mailDriver: "",
    mailHost: "",
    mailPort: "",
    mailUsername: "",
    mailPassword: "",
    mailEncryption: "",
    mailFromAddress: "",
    mailFromName: "",
  });

  /* ================================
     FETCH SETTINGS ON LOAD
  ================================= */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/email-settings`, {
          withCredentials: true,
        });

        if (res.data?.data) setForm(res.data.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load email settings");
      }
    };

    fetchSettings();
  }, []);

  /* ================================
     HANDLE FIELD CHANGE
  ================================= */
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================================
     SAVE SETTINGS
  ================================= */
  const saveChanges = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/email-settings/save`, form, {
        withCredentials: true,
      });

      alert(res.data.message || "Settings saved successfully");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     SEND TEST EMAIL
  ================================= */
  const sendTestMail = async () => {
    if (!testEmail.trim()) {
      alert("Enter email to send test mail");
      return;
    }

    try {
      setTestLoading(true);

      const res = await axios.post(
        `${BASE_URL}/email-settings/send-test`,
        { email: testEmail },
        { withCredentials: true }
      );

      alert(res.data.message || "Test mail sent successfully");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to send test mail");
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        Email Settings
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        This SMTP will be used for system-level email sending.
      </p>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        {[
          { key: "mailDriver", label: "Mail Driver", placeholder: "SMTP" },
          {
            key: "mailHost",
            label: "Mail Host",
            placeholder: "smtp.gmail.com",
          },
          { key: "mailPort", label: "Mail Port", placeholder: "465" },
          {
            key: "mailUsername",
            label: "Mail Username",
            placeholder: "admin@example.com",
          },
          {
            key: "mailPassword",
            label: "Mail Password",
            type: "password",
            placeholder: "••••••••",
          },
          {
            key: "mailEncryption",
            label: "Mail Encryption",
            placeholder: "SSL",
          },
          {
            key: "mailFromAddress",
            label: "Mail From Address",
            placeholder: "admin@example.com",
          },
          {
            key: "mailFromName",
            label: "Mail From Name",
            placeholder: "MindBoxx",
          },
        ].map((field, idx) => (
          <div key={idx}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={form[field.key] || ""}
              placeholder={field.placeholder}
              onChange={(e) => updateField(field.key, e.target.value)}
              className="
                w-full mt-1 p-2 rounded-lg
                border border-gray-300 dark:border-gray-700
                bg-white dark:bg-[#1f1f23]
                text-gray-800 dark:text-gray-200
              "
            />
          </div>
        ))}
      </div>

      {/* Test Mail + Save Buttons */}
      <div className="flex flex-col md:flex-row gap-3 mt-8 items-center">
        {/* Test Email Input */}
        <input
          type="email"
          placeholder="Enter test email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="
            w-full md:w-64 p-2 rounded-lg
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-[#1f1f23]
            text-gray-800 dark:text-gray-200
          "
        />

        {/* Send Test Mail */}
        <button
          onClick={sendTestMail}
          disabled={testLoading}
          className="
            px-4 py-2 rounded-lg
            bg-black dark:bg-white 
            text-white dark:text-black
            w-full md:w-auto
          "
        >
          {testLoading ? "Sending..." : "Send Test Mail"}
        </button>

        {/* Save Changes */}
        <button
          onClick={saveChanges}
          disabled={loading}
          className="
            px-4 py-2 rounded-lg
            bg-black dark:bg-white 
            text-white dark:text-black
            w-full md:w-auto
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
