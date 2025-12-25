import React, { useState } from "react";
import { Country, State, City } from "country-state-city";

const inputClass =
  "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

const labelClass = "text-xs font-medium text-gray-700 dark:text-gray-300";

const AddCustomer = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({
    firstName: "",
    surName: "",
    emailId: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    contact: "",
  });

  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    setCountryCode(code);
    setStateCode("");
    setForm({
      ...form,
      country: Country.getCountryByCode(code)?.name || "",
      state: "",
      city: "",
    });
  };

  const handleStateChange = (e) => {
    const code = e.target.value;
    setStateCode(code);
    setForm({
      ...form,
      state: State.getStateByCodeAndCountry(code, countryCode)?.name || "",
      city: "",
    });
  };

  const handleCityChange = (e) => {
    setForm({ ...form, city: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.contact) {
      alert("First name and phone number are required");
      return;
    }
    onCreate?.(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111218] w-full max-w-4xl rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add Customer
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`${inputClass} mt-1`}
              />
            </div>

            <div>
              <label className={labelClass}>Surname</label>
              <input
                name="surName"
                value={form.surName}
                onChange={handleChange}
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              className={`${inputClass} mt-1`}
            />
          </div>

          {/* ADDRESS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="addressLine1"
              placeholder="Address Line 1"
              value={form.addressLine1}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={form.addressLine2}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* COUNTRY / STATE / CITY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={countryCode}
              onChange={handleCountryChange}
              className={inputClass}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={stateCode}
              onChange={handleStateChange}
              className={inputClass}
              disabled={!countryCode}
            >
              <option value="">Select State</option>
              {State.getStatesOfCountry(countryCode).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={form.city}
              onChange={handleCityChange}
              className={inputClass}
              disabled={!stateCode}
            >
              <option value="">Select City</option>
              {City.getCitiesOfState(countryCode, stateCode).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* ZIP + PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="zip"
              placeholder="Postcode / Zip"
              value={form.zip}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="contact"
              placeholder="Phone Number"
              value={form.contact}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
