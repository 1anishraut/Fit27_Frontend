import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { useNavigate } from "react-router-dom";

export default function CreateClasses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    cost: "",
    active: true,
    links: [{ url: "", label: "" }],
  });

  // -------------------
  // HANDLE INPUT CHANGE
  // -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------
  // HANDLE LINKS UPDATE
  // -------------------
  const updateLink = (index, field, value) => {
    const updated = [...formData.links];
    updated[index][field] = value;
    setFormData({ ...formData, links: updated });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { url: "", label: "" }],
    });
  };

  const removeLink = (index) => {
    const updated = [...formData.links];
    updated.splice(index, 1);
    setFormData({ ...formData, links: updated });
  };

  // -------------------
  // SUBMIT FORM
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/classes/create`, formData, {
        withCredentials: true,
      });

      alert("Class created successfully");
      navigate(-1);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] min-h-screen">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create New Class
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Add a new workout/training class with full details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#0D0D0F] p-6 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700"
      >
        {/* CLASS NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium dark:text-white">
            Class Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
            text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            className="w-full mt-1 border p-2 rounded-md h-24 bg-white dark:bg-[#1A1A1C]
            text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={formData.description}
            onChange={handleChange}
            maxLength={300}
            required
          ></textarea>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.description.length}/300 characters
          </p>
        </div>

        {/* CAPACITY & COST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-white">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-white">
              Cost (₹)
            </label>
            <input
              type="number"
              name="cost"
              className="w-full mt-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
              text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ACTIVE TOGGLE */}
        <div className="mt-4">
          <label className="text-sm font-medium dark:text-white">Active</label>
          <label className="flex items-center cursor-pointer mt-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={() =>
                  setFormData({ ...formData, active: !formData.active })
                }
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition ${
                  formData.active ? "bg-green-600" : "bg-gray-600"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                  formData.active
                    ? "translate-x-6 bg-white"
                    : "translate-x-0 bg-white"
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* LINKS REPEATER */}
        <div className="mt-6">
          <h2 className="text-md font-semibold text-gray-900 dark:text-white">
            External Links
          </h2>

          {formData.links.map((link, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3"
            >
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className="border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
                text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(index, "label", e.target.value)}
                  className="flex-1 border p-2 rounded-md bg-white dark:bg-[#1A1A1C]
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                />

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLink}
            className="mt-3 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            + Add Link
          </button>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/adminDashboard/allClasses")}
            className="px-5 py-2 border border-gray-300 dark:border-gray-700
            rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Class
          </button>
        </div>
      </form>
    </div>
  );
}
