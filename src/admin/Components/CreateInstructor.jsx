import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { FiTrash2 } from "react-icons/fi";

const CreateInstructor = () => {
  const navigate = useNavigate();

  const [classesList, setClassesList] = useState([]);

  const [files, setFiles] = useState({
    avatar: null,
    document: null,
    insurance: null,
    qualification: null,
  });

  const [links, setLinks] = useState([{ url: "", label: "" }]);

  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    emailId: "",
    contact: "",
    hoursPayment: "",
    rentPayment: "",
    profileInfo: "",
    personalTrainer: false,
    status: "active",
    classes: "",
    specialNote: "",
  });

  const inputClass =
    "w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

  /* ============================================================
      FETCH CLASSES
  ============================================================ */
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes/all`, {
        withCredentials: true,
      });
      setClassesList(res?.data?.data || []);
    } catch (error) {
      console.log("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ============================================================
      INPUT HANDLERS
  ============================================================ */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleLinkChange = (i, field, value) => {
    const updated = [...links];
    updated[i][field] = value;
    setLinks(updated);
  };

  const addLink = () => setLinks([...links, { url: "", label: "" }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  /* ============================================================
      SUBMIT
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, val]) =>
        payload.append(key, val)
      );

      // Append links
      links.forEach((item, i) => {
        payload.append(`links[${i}][url]`, item.url);
        payload.append(`links[${i}][label]`, item.label);
      });

      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      const res = await axios.post(`${BASE_URL}/instructor/create`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("Instructor created successfully");
        navigate("/adminDashboard/instructors");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create Instructor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Fill out instructor details, documents & class assignments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFORMATION */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                General information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Fname */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Surname */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Surname
                  </label>
                  <input
                    name="surName"
                    value={formData.surName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Phone Number
                  </label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Hours payment */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Hourly Payment
                  </label>
                  <input
                    name="hoursPayment"
                    value={formData.hoursPayment}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Rent */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Rent Payment
                  </label>
                  <input
                    name="rentPayment"
                    value={formData.rentPayment}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* PROFILE INFO */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Profile Information
              </h2>

              <textarea
                name="profileInfo"
                value={formData.profileInfo}
                onChange={handleChange}
                className={`${inputClass} h-32`}
              />
            </div>

            {/* LINKS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Links</h2>

              {links.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 mt-4">
                  <input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => handleLinkChange(i, "url", e.target.value)}
                    className="col-span-5 border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-300"
                  />
                  <input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) =>
                      handleLinkChange(i, "label", e.target.value)
                    }
                    className="col-span-5 border p-2 rounded-md bg-white dark:bg-[#0D0D0F] text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="col-span-2 flex justify-center items-center"
                  >
                    <FiTrash2 className="text-red-500 text-xl" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addLink}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                + Add Link
              </button>
            </div>

            {/* ASSIGN CLASSES */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Assign Class
              </h2>

              <select
                name="classes"
                value={formData.classes}
                onChange={handleChange}
                className={`${inputClass} mt-3`}
              >
                <option value="">Select Class</option>
                {classesList.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            {/* PERSONAL TRAINER FIXED TOGGLE */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Personal Trainer
              </h2>

              <label className="flex items-center cursor-pointer mt-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.personalTrainer}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        personalTrainer: !formData.personalTrainer,
                      })
                    }
                    className="sr-only"
                  />

                  <div
                    className={`w-10 h-5 rounded-full transition ${
                      formData.personalTrainer ? "bg-green-600" : "bg-gray-600"
                    }`}
                  ></div>

                  <div
                    className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition ${
                      formData.personalTrainer
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></div>
                </div>

                <span className="ml-3 text-gray-700 dark:text-gray-300">
                  Mark as personal trainer
                </span>
              </label>
            </div>

            {/* STATUS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Status</h2>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} mt-3`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </div>

            {/* DOCUMENTS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] shadow-xl border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Documents
              </h2>

              <div className="space-y-5 mt-4">
                {/* Avatar */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  {files.avatar && (
                    <img
                      src={URL.createObjectURL(files.avatar)}
                      className="w-32 h-32 rounded-full mt-3 object-cover"
                    />
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Qualification
                  </label>
                  <input
                    type="file"
                    name="qualification"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>

                {/* Document */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Document
                  </label>
                  <input
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>

                {/* Insurance */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Insurance
                  </label>
                  <input
                    type="file"
                    name="insurance"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/adminDashboard/instructors")}
            className="px-5 py-2 border border-gray-500 dark:border-gray-700 rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInstructor;
