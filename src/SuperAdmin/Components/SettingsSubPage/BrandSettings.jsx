import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

export default function BrandSettings() {
  const [loading, setLoading] = useState(true);

  // TEXT STATES
  const [name, setName] = useState("");
  const [titleText, setTitleText] = useState("");
  const [footerText, setFooterText] = useState("");

  // PREVIEW STATES
  const [logoDarkPreview, setLogoDarkPreview] = useState(null);
  const [logoLightPreview, setLogoLightPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // FILE STATES
  const [logoDarkFile, setLogoDarkFile] = useState(null);
  const [logoLightFile, setLogoLightFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  // ------------------------- LOAD EXISTING BRAND -------------------------
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/brand/all`, {
          withCredentials: true,
        });

        if (res.data.data.length > 0) {
          const brand = res.data.data[0];

          setName(brand.name || "");
          setTitleText(brand.titleText || "");
          setFooterText(brand.footerText || "");

          if (brand.logoDark)
            setLogoDarkPreview(`${BASE_URL}/${brand.logoDark}`);

          if (brand.logoLight)
            setLogoLightPreview(`${BASE_URL}/${brand.logoLight}`);

          if (brand.faviIcon)
            setFaviconPreview(`${BASE_URL}/${brand.faviIcon}`);
        }
      } catch (err) {
        console.error("Brand Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, []);

  // ------------------------- FILE HANDLER -------------------------
  const handleFile = (e, setPreview, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFile(file);
    }
  };

  // ------------------------- SAVE BRAND -------------------------
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("titleText", titleText);
      formData.append("footerText", footerText);

      if (logoDarkFile) formData.append("logoDark", logoDarkFile);
      if (logoLightFile) formData.append("logoLight", logoLightFile);
      if (faviconFile) formData.append("faviIcon", faviconFile);

      await axios.post(`${BASE_URL}/brand/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Brand updated successfully!");
    } catch (err) {
      console.error("Brand Save Error:", err);
      alert("Failed to save brand");
    }
  };

  const handleCancel = () => window.location.reload();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-3">
        Brand Settings
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Logo Dark */}
        <div className="border rounded-xl bg-white p-4 shadow-sm">
          <p className="font-medium text-gray-700 mb-2">Logo Dark</p>
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            {logoDarkPreview ? (
              <img src={logoDarkPreview} className="h-full object-contain" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label className="block mt-3 cursor-pointer">
            <div className="bg-black text-white text-sm rounded-lg px-3 py-2 text-center">
              Choose file here
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                handleFile(e, setLogoDarkPreview, setLogoDarkFile)
              }
            />
          </label>
        </div>

        {/* Logo Light */}
        <div className="border rounded-xl bg-white p-4 shadow-sm">
          <p className="font-medium text-gray-700 mb-2">Logo Light</p>
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            {logoLightPreview ? (
              <img src={logoLightPreview} className="h-full object-contain" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label className="block mt-3 cursor-pointer">
            <div className="bg-black text-white text-sm rounded-lg px-3 py-2 text-center">
              Choose file here
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                handleFile(e, setLogoLightPreview, setLogoLightFile)
              }
            />
          </label>
        </div>

        {/* Favicon */}
        <div className="border rounded-xl bg-white p-4 shadow-sm">
          <p className="font-medium text-gray-700 mb-2">Favicon</p>
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            {faviconPreview ? (
              <img src={faviconPreview} className="h-full object-contain" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label className="block mt-3 cursor-pointer">
            <div className="bg-black text-white text-sm rounded-lg px-3 py-2 text-center">
              Choose file here
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e, setFaviconPreview, setFaviconFile)}
            />
          </label>
        </div>
      </div>

      {/* TEXT FIELDS */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="text-gray-700 font-medium">Brand Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Title Text</label>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Footer Text</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-4 mt-10">
        <button
          onClick={handleCancel}
          className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
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
