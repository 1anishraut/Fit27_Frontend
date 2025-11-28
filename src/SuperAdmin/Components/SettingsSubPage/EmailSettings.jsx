import React from "react";

export default function EmailSettings() {
  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        Email Settings
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        This SMTP will be used for system-level email sending. Additionally, if
        a company user does not set their SMTP, then this SMTP will be used for
        sending emails.
      </p>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        {[
          { label: "Mail Driver", placeholder: "SMTP" },
          { label: "Mail Host", placeholder: "smtp.hostinger.com" },
          { label: "Mail Port", placeholder: "465" },
          { label: "Mail Username", placeholder: "admin@example.com" },
          { label: "Mail Password", placeholder: "••••••••", type: "password" },
          { label: "Mail Encryption", placeholder: "SSL" },
          { label: "Mail From Address", placeholder: "admin@example.com" },
          { label: "Mail From Name", placeholder: "MindBoxx" },
        ].map((item, idx) => (
          <div key={idx}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              {item.label}
            </label>

            <input
              type={item.type || "text"}
              placeholder={item.placeholder}
              className="
                w-full mt-1 
                border border-gray-300 dark:border-gray-700 
                p-2 rounded-lg 
                bg-white dark:bg-[#1f1f23] 
                text-gray-800 dark:text-gray-200
              "
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          className="
            px-4 py-2 
            bg-black dark:bg-white 
            text-white dark:text-black 
            rounded-lg
          "
        >
          Send Test Mail
        </button>

        <button
          className="
            px-4 py-2 
            bg-black dark:bg-white 
            text-white dark:text-black 
            rounded-lg
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
