import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { useDispatch } from "react-redux";
import { addAdminBrandData } from "../../../Utils/brandDataAdmin";

/* =====================================================
   TIMEZONE LIST (400+ IANA ZONES – NO NPM LIBRARY)
===================================================== */
const FALLBACK_TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Dubai",
  "Australia/Sydney",
];

const getAllTimezones = () => {
  try {
    if (Intl?.supportedValuesOf) {
      return Intl.supportedValuesOf("timeZone");
    }
  } catch (e) {
    console.warn("Timezone API not supported, using fallback");
  }
  return FALLBACK_TIMEZONES;
};

export default function BrandSettings() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  /* ---------------- TEXT STATES ---------------- */
  const [name, setName] = useState("");
  const [titleText, setTitleText] = useState("");
  const [footerText, setFooterText] = useState("");

  /* ---------------- GLOBAL SAAS SETTINGS ---------------- */
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");

  /* ---------------- FILE STATES ---------------- */
  const [logoDarkFile, setLogoDarkFile] = useState(null);
  const [logoLightFile, setLogoLightFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  /* ---------------- PREVIEW STATES ---------------- */
  const [logoDarkPreview, setLogoDarkPreview] = useState(null);
  const [logoLightPreview, setLogoLightPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  /* ---------------- TIMEZONE DATA ---------------- */
  const allTimezones = useMemo(() => getAllTimezones(), []);

  const groupedTimezones = useMemo(() => {
    return allTimezones.reduce((acc, tz) => {
      const region = tz.split("/")[0];
      if (!acc[region]) acc[region] = [];
      acc[region].push(tz);
      return acc;
    }, {});
  }, [allTimezones]);

  /* =====================================================
     LOAD BRAND DATA
  ===================================================== */
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/adminBrand/all`, {
          withCredentials: true,
        });

        if (res.data.data.length > 0) {
          const brand = res.data.data[0];

          setName(brand.name || "");
          setTitleText(brand.titleText || "");
          setFooterText(brand.footerText || "");
          setTimezone(brand.timezone || "Asia/Kolkata");
          setCurrency(brand.currency || "INR");

          if (brand.adminLogoDark)
            setLogoDarkPreview(`${BASE_URL}/${brand.adminLogoDark}`);
          if (brand.adminLogoLight)
            setLogoLightPreview(`${BASE_URL}/${brand.adminLogoLight}`);
          if (brand.adminFaviIcon)
            setFaviconPreview(`${BASE_URL}/${brand.adminFaviIcon}`);

          dispatch(addAdminBrandData(brand));
        }
      } catch (err) {
        console.error("Brand Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [dispatch]);

  /* =====================================================
     FILE HANDLER
  ===================================================== */
  const handleFile = (e, setPreview, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFile(file);
    }
  };

  /* =====================================================
     SAVE BRAND
  ===================================================== */
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("titleText", titleText);
      formData.append("footerText", footerText);
      formData.append("timezone", timezone);
      formData.append("currency", currency);

      if (logoDarkFile) formData.append("adminLogoDark", logoDarkFile);
      if (logoLightFile) formData.append("adminLogoLight", logoLightFile);
      if (faviconFile) formData.append("adminFaviIcon", faviconFile);

      await axios.post(`${BASE_URL}/adminBrand/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Brand updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save brand");
    }
  };

  if (loading) return <p>Loading...</p>;

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Brand Settings
      </h1>

      {/* ================= LOGOS ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            label: "Logo Dark",
            preview: logoDarkPreview,
            setPreview: setLogoDarkPreview,
            setFile: setLogoDarkFile,
          },
          {
            label: "Logo Light",
            preview: logoLightPreview,
            setPreview: setLogoLightPreview,
            setFile: setLogoLightFile,
          },
          {
            label: "Favicon",
            preview: faviconPreview,
            setPreview: setFaviconPreview,
            setFile: setFaviconFile,
          },
        ].map((item, i) => (
          <div key={i} className="border rounded-xl bg-white p-4 shadow-sm">
            <p className="font-medium text-gray-700 mb-2">{item.label}</p>

            <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
              {item.preview ? (
                <img src={item.preview} className="h-full object-contain" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            <label className="block mt-3 cursor-pointer">
              <div className="bg-black text-white text-sm rounded-lg px-3 py-2 text-center">
                Choose file
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e, item.setPreview, item.setFile)}
              />
            </label>
          </div>
        ))}
      </div>

      {/* ================= TEXT + GLOBAL SETTINGS ================= */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Input label="Brand Name" value={name} onChange={setName} />
        <Input label="Title Text" value={titleText} onChange={setTitleText} />
        <Input
          label="Footer Text"
          value={footerText}
          onChange={setFooterText}
        />

        {/* TIMEZONE (ALL COUNTRIES) */}
        <div>
          <label className="font-medium text-gray-700">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 max-h-60"
          >
            {Object.entries(groupedTimezones).map(([region, zones]) => (
              <optgroup key={region} label={region}>
                {zones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* CURRENCY */}
        <div>
          <label className="font-medium text-gray-700">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="AUD">AUD ($)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-4 mt-10">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg border border-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL INPUT COMPONENT ================= */
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
