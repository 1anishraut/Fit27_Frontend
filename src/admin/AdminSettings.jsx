import React, { useEffect, useRef, useState } from "react";
import {
  FiSettings,
  FiMail,
  FiDollarSign,
  FiCloud,
  FiLock,
  FiBell,
  FiDatabase,
  FiTool,
  FiShield,
  FiCpu,
} from "react-icons/fi";

import BrandSettings from "../admin/Components/SettingsSubPage/BrandSettings";
import EmailSettings from "../admin/Components/SettingsSubPage/EmailSettings";
import PaymentSettings from "../admin/Components/SettingsSubPage/PaymentSettings";
import PusherSettings from "../admin/Components/SettingsSubPage/PusherSettings";
import ReCaptchaSettings from "../admin/Components/SettingsSubPage/ReCaptchaSettings";
import StorageSettings from "../admin/Components/SettingsSubPage/StorageSettings";
import SEOSettings from "../admin/Components/SettingsSubPage/SEOSettings";
import CookieSettings from "../admin/Components/SettingsSubPage/CookieSettings";
import CacheSettings from "../admin/Components/SettingsSubPage/CacheSettings";
import ChatGPTSettings from "../admin/Components/SettingsSubPage/ChatGPTSettings";

// ⭐ Use icon components (not JSX icons)
const sections = [
  {
    id: "brand-settings",
    label: "Brand",
    icon: FiSettings,
    component: <BrandSettings />,
  },
  // {
  //   id: "email-settings",
  //   label: "Email",
  //   icon: FiMail,
  //   component: <EmailSettings />,
  // },
  // {
  //   id: "payment-settings",
  //   label: "Payment ",
  //   icon: FiDollarSign,
  //   component: <PaymentSettings />,
  // },
  // {
  //   id: "pusher-settings",
  //   label: "Pusher",
  //   icon: FiBell,
  //   component: <PusherSettings />,
  // },
  // {
  //   id: "recaptcha-settings",
  //   label: "ReCaptcha",
  //   icon: FiShield,
  //   component: <ReCaptchaSettings />,
  // },
  // {
  //   id: "storage-settings",
  //   label: "Storage",
  //   icon: FiDatabase,
  //   component: <StorageSettings />,
  // },
  // {
  //   id: "seo-settings",
  //   label: "SEO",
  //   icon: FiTool,
  //   component: <SEOSettings />,
  // },
  // {
  //   id: "cookie-settings",
  //   label: "Cookie",
  //   icon: FiLock,
  //   component: <CookieSettings />,
  // },
  // {
  //   id: "cache-settings",
  //   label: "Cache",
  //   icon: FiCloud,
  //   component: <CacheSettings />,
  // },
  // {
  //   id: "chatgpt-settings",
  //   label: "Chat GPT",
  //   icon: FiCpu,
  //   component: <ChatGPTSettings />,
  // },
];

export default function AdminSettings() {
  const [active, setActive] = useState("brand-settings");
  const contentRef = useRef(null);

  // Scroll spy
  useEffect(() => {
    if (!contentRef.current) return;

    requestAnimationFrame(() => {
      const options = {
        root: contentRef.current,
        threshold: 0.1,
        rootMargin: "0px 0px -70% 0px",
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, options);

      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) io.observe(el);
      });

      return () => io.disconnect();
    });
  }, []);

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (contentRef.current && target) {
      contentRef.current.scrollTo({
        top: target.offsetTop - 5,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#F2F0EF] dark:bg-[#09090B] dark:text-gray-200">
      {/* DESKTOP / TABLET SIDEBAR */}
      <div className="hidden md:block w-40 bg-white dark:bg-[#0D0D0F] dark:border-gray-700 h-[90%] overflow-auto p-4 sticky top-0 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Settings
        </h2>

        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={
              active === s.id
                ? "cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm bg-blue-600 text-white"
                : "cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
            }
          >
            {/* ⭐ Responsive icon sizes */}
            <s.icon className="text-[26px] md:text-[22px] lg:text-[18px]" />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* MOBILE NAV ICON BAR */}
      <div className="md:hidden w-16 bg-white dark:bg-[#0D0D0F] border-r dark:border-gray-700 h-full overflow-auto p-4 flex flex-col gap-6 sticky top-0">
        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={
              active === s.id
                ? "cursor-pointer flex items-center justify-center p-3 rounded-lg bg-blue-600 text-white"
                : "cursor-pointer flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
            }
          >
            {/* ⭐ Mobile icon size */}
            <s.icon className="text-[26px]" />
          </div>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-5"
      >
        {sections.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className="bg-white dark:bg-[#0D0D0F] border border-gray-300 dark:border-gray-700 shadow-sm rounded-xl p-5 md:p-6 transition-colors"
          >
            {s.component}
          </div>
        ))}
      </div>
    </div>
  );
}
