/** ============================================================
      EDIT INSTRUCTOR (with Bank Info + QR Image Support)
    ============================================================ */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { FiTrash2 } from "react-icons/fi";

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state?.item;

  const [classesList, setClassesList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showClassSelector, setShowClassSelector] = useState(false);

  const [files, setFiles] = useState({
    avatar: null,
    document: null,
    insurance: null,
    qualification: null,
    qrImage: null,
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
    classes: [],
    specialNote: "",

    // NEW BANK FIELDS
    bankName: "",
    accountNumber: "",
    bankCode: "",
    branchName: "",
  });

  const inputClass =
    "w-full border p-2 rounded-md bg-white dark:bg-[#0D0D0F] " +
    "text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

  /* ------------------------------------------------
      FETCH CLASSES
  ------------------------------------------------ */
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

  /* ------------------------------------------------
      PREFILL EXISTING DATA
  ------------------------------------------------ */
  useEffect(() => {
    if (!existing) return;

    setFormData({
      firstName: existing.firstName,
      surName: existing.surName,
      emailId: existing.emailId,
      contact: existing.contact,
      hoursPayment: existing.hoursPayment,
      rentPayment: existing.rentPayment,
      profileInfo: existing.profileInfo,
      personalTrainer: existing.personalTrainer,
      status: existing.status,
      classes: existing.classes?.map((cls) => cls._id) || [],
      specialNote: existing.specialNote || "",

      // PREFILL NEW BANK FIELDS
      bankName: existing.bankName || "",
      accountNumber: existing.accountNumber || "",
      bankCode: existing.bankCode || "",
      branchName: existing.branchName || "",
    });

    setLinks(
      existing.links && existing.links.length > 0
        ? existing.links
        : [{ url: "", label: "" }]
    );
  }, [existing]);

  /* ------------------------------------------------
      INPUT HANDLERS
  ------------------------------------------------ */
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

  /* ------------------------------------------------
      CLASS CHECKBOX
  ------------------------------------------------ */
  const handleClassCheckbox = (classId) => {
    setFormData((prev) => {
      const exists = prev.classes.includes(classId);
      return {
        ...prev,
        classes: exists
          ? prev.classes.filter((id) => id !== classId)
          : [...prev.classes, classId],
      };
    });
  };

  /* ------------------------------------------------
      SUBMIT HANDLER
  ------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "classes") payload.append("classes", JSON.stringify(val));
        else payload.append(key, val);
      });

      payload.append("links", JSON.stringify(links));

      Object.entries(files).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      const res = await axios.patch(
        `${BASE_URL}/instructor/update/${id}`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Instructor updated successfully");
        navigate("/adminDashboard/instructors");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  /* ------------------------------------------------
      UI
  ------------------------------------------------ */
  return (
    <div className="p-6 bg-[#F2F0EF] dark:bg-[#09090B] transition-all">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Edit Instructor
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Update instructor details & documents.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFO */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold dark:text-white">
                General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First Name"
                />

                <input
                  name="surName"
                  value={formData.surName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Surname"
                />

                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Email Address"
                />

                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Phone Number"
                />

                <input
                  name="hoursPayment"
                  value={formData.hoursPayment}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Hourly Payment"
                />

                <input
                  name="rentPayment"
                  value={formData.rentPayment}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Rent Payment"
                />
              </div>
            </div>

            {/* PROFILE */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold dark:text-white">
                Profile Information
              </h2>
              <textarea
                name="profileInfo"
                value={formData.profileInfo}
                onChange={handleChange}
                className={`${inputClass} h-32 mt-3`}
                placeholder="Write something..."
              />
            </div>

            {/* LINKS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold dark:text-white">Links</h2>

              {links.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 mt-4">
                  <input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => handleLinkChange(i, "url", e.target.value)}
                    className="col-span-5 border p-2 rounded-md bg-white dark:bg-[#0D0D0F]"
                  />

                  <input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) =>
                      handleLinkChange(i, "label", e.target.value)
                    }
                    className="col-span-5 border p-2 rounded-md bg-white dark:bg-[#0D0D0F]"
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
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold dark:text-white">
                  Assign Classes
                </h2>

                <button
                  type="button"
                  onClick={() => setShowClassSelector(!showClassSelector)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {showClassSelector ? "Hide" : "Browse Classes"}
                </button>
              </div>

              {/* SELECTED */}
              {formData.classes.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-[#1A1A1C] rounded-md">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                    Selected Classes:
                  </h3>

                  <ul className="mt-2 space-y-1 text-gray-800 dark:text-gray-200">
                    {formData.classes.map((id) => {
                      const cls = classesList.find((c) => c._id === id);
                      return (
                        <li key={id}>
                          • {cls?.name} — ₹{cls?.cost}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* SEARCH + CHECKBOXES */}
              {showClassSelector && (
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={`${inputClass} mb-3`}
                  />

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {classesList
                      .filter((cls) =>
                        cls.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                      .map((cls) => (
                        <label
                          key={cls._id}
                          className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1A1A1A]"
                        >
                          <input
                            type="checkbox"
                            checked={formData.classes.includes(cls._id)}
                            onChange={() => handleClassCheckbox(cls._id)}
                            className="w-4 h-4"
                          />

                          <span className="text-gray-900 dark:text-gray-200">
                            {cls.name} — ₹{cls.cost}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* PERSONAL TRAINER */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
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
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
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

            {/* DOCUMENTS & BANK DETAILS */}
            <div className="border rounded-xl p-6 bg-white dark:bg-[#0D0D0F] border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold dark:text-white">
                Documents & Bank Info
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

                  {!files.avatar && existing?.avatar && (
                    <img
                      src={`${BASE_URL}${existing.avatar}`}
                      className="w-32 h-32 rounded-full mt-3 object-cover border"
                    />
                  )}

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
                    Qualification (PDF)
                  </label>
                  <input
                    type="file"
                    name="qualification"
                    onChange={handleFileChange}
                    className="mt-2"
                    accept="application/pdf"
                  />

                  {existing?.qualification && !files.qualification && (
                    <a
                      href={`${BASE_URL}${existing.qualification}`}
                      target="_blank"
                      className="text-blue-400 text-sm underline mt-1 block"
                    >
                      View Current File
                    </a>
                  )}
                </div>

                {/* Document */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Document (PDF)
                  </label>
                  <input
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                    className="mt-2"
                    accept="application/pdf"
                  />

                  {existing?.document && !files.document && (
                    <a
                      href={`${BASE_URL}${existing.document}`}
                      target="_blank"
                      className="text-blue-400 text-sm underline mt-1 block"
                    >
                      View Current File
                    </a>
                  )}
                </div>

                {/* Insurance */}
                <div>
                  <label className="text-sm font-medium dark:text-white">
                    Insurance (PDF)
                  </label>
                  <input
                    type="file"
                    name="insurance"
                    onChange={handleFileChange}
                    className="mt-2"
                    accept="application/pdf"
                  />

                  {existing?.insurance && !files.insurance && (
                    <a
                      href={`${BASE_URL}${existing.insurance}`}
                      target="_blank"
                      className="text-blue-400 text-sm underline mt-1 block"
                    >
                      View Current File
                    </a>
                  )}
                </div>
              </div>

              {/* BANK DETAILS */}
              <div className="mt-6 border-t border-gray-600 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Bank Details
                </h3>

                <input
                  name="bankName"
                  placeholder="Bank Name"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`${inputClass} mb-3`}
                />

                <input
                  name="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`${inputClass} mb-3`}
                />

                <input
                  name="bankCode"
                  placeholder="IFSC Code"
                  value={formData.bankCode}
                  onChange={handleChange}
                  className={`${inputClass} mb-3`}
                />

                <input
                  name="branchName"
                  placeholder="Branch Name"
                  value={formData.branchName}
                  onChange={handleChange}
                  className={`${inputClass} mb-3`}
                />

                {/* QR IMAGE */}
                <label className="text-sm font-medium dark:text-white">
                  QR Image
                </label>
                <input
                  type="file"
                  name="qrImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />

                {/* Existing QR */}
                {!files.qrImage && existing?.qrImage && (
                  <img
                    src={`${BASE_URL}${existing.qrImage}`}
                    className="w-32 h-32 mt-3 rounded-md object-cover border"
                  />
                )}

                {/* New QR Preview */}
                {files.qrImage && (
                  <img
                    src={URL.createObjectURL(files.qrImage)}
                    className="w-32 h-32 mt-3 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstructor;
