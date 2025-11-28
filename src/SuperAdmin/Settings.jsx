import React, { useEffect, useRef, useState } from "react";
import BrandSettings from "../SuperAdmin/Components/SettingsSubPage/BrandSettings";
import EmailSettings from "../SuperAdmin/Components/SettingsSubPage/EmailSettings";
import PaymentSettings from "../SuperAdmin/Components/SettingsSubPage/PaymentSettings";
import PusherSettings from "../SuperAdmin/Components/SettingsSubPage/PusherSettings";
import ReCaptchaSettings from "../SuperAdmin/Components/SettingsSubPage/ReCaptchaSettings";
import StorageSettings from "../SuperAdmin/Components/SettingsSubPage/StorageSettings";
import SEOSettings from "../SuperAdmin/Components/SettingsSubPage/SEOSettings";
import CookieSettings from "../SuperAdmin/Components/SettingsSubPage/CookieSettings";
import CacheSettings from "../SuperAdmin/Components/SettingsSubPage/CacheSettings";
import ChatGPTSettings from "../SuperAdmin/Components/SettingsSubPage/ChatGPTSettings";

const sections = [
  {
    id: "brand-settings",
    label: "Brand Settings",
    component: <BrandSettings />,
  },
  {
    id: "email-settings",
    label: "Email Settings",
    component: <EmailSettings />,
  },
  {
    id: "payment-settings",
    label: "Payment Settings",
    component: <PaymentSettings />,
  },
  {
    id: "pusher-settings",
    label: "Pusher Settings",
    component: <PusherSettings />,
  },
  {
    id: "recaptcha-settings",
    label: "ReCaptcha Settings",
    component: <ReCaptchaSettings />,
  },
  {
    id: "storage-settings",
    label: "Storage Settings",
    component: <StorageSettings />,
  },
  { id: "seo-settings", label: "SEO Settings", 
    component: <SEOSettings />
 },
  {
    id: "cookie-settings",
    label: "Cookie Settings",
    component: <CookieSettings />,
  },
  {
    id: "cache-settings",
    label: "Cache Settings",
    component: <CacheSettings />,
  },
  {
    id: "chatgpt-settings",
    label: "Chat GPT Settings",
    component: <ChatGPTSettings />,
  },
];

export default function Settings() {
  const [active, setActive] = useState("brand-settings");
  const observer = useRef(null);

  useEffect(() => {
    const options = { root: null, threshold: 0.3 };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, options);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.current.observe(el);
    });

    return () => observer.current.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#f8f9fa]">
      {/* Left Navigation */}
      <div className="w-64 bg-white border-r h-full overflow-auto sticky top-0 p-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`cursor-pointer px-3 py-2 rounded-md mb-1 text-sm ${
              active === s.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-16">
        {sections.map((s) => (
          <div
            id={s.id}
            key={s.id}
            className="bg-white shadow-sm border rounded-lg p-6"
          >
            {s.component}
          </div>
        ))}
      </div>
    </div>
  );
}
