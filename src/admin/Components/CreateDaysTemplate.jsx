// src/admin/Classes/CreateDaysTemplates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utils/Constants";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { toast } from "react-toastify"; // if you use toast

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyRow = {
  startedAt: "",
  endedAt: "",
  classId: "",
  location: "",
  instructorId: "",
};

const CreateDaysTemplates = () => {
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [active, setActive] = useState(true);

  const [rowsByDay, setRowsByDay] = useState(() => {
    const obj = {};
    DAYS.forEach((d) => {
      obj[d] = d === "Monday" ? [{ ...emptyRow }] : [];
    });
    return obj;
  });

  const [openDay, setOpenDay] = useState(() => {
    const o = {};
    DAYS.forEach((d) => {
      o[d] = d === "Monday";
    });
    return o;
  });

  const [classes, setClasses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [loading, setLoading] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clsRes, locRes, instRes] = await Promise.all([
          axios.get(`${BASE_URL}/classes/all`), // change if needed
          axios.get(`${BASE_URL}/location/all`), // change if needed
          axios.get(`${BASE_URL}/instructors/all`), // change if needed
        ]);

        setClasses(clsRes.data.data || clsRes.data || []);
        setLocations(locRes.data.data || locRes.data || []);
        setInstructors(instRes.data.data || instRes.data || []);
      } catch (err) {
        console.error(err);
        // toast.error("Failed to load dropdown data");
        alert("Failed to load classes/locations/instructors");
      }
    };

    fetchAll();
  }, []);

  const handleRowChange = (day, index, field, value) => {
    setRowsByDay((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );
      return copy;
    });
  };

  const addRow = (day) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...emptyRow }],
    }));
  };

  const removeRow = (day, index) => {
    setRowsByDay((prev) => {
      const copy = { ...prev };
      copy[day] = copy[day].filter((_, i) => i !== index);
      return copy;
    });
  };

  const resetForm = () => {
    setLabel("");
    setActive(true);
    setRowsByDay(() => {
      const obj = {};
      DAYS.forEach((d) => {
        obj[d] = d === "Monday" ? [{ ...emptyRow }] : [];
      });
      return obj;
    });
    setOpenDay(() => {
      const o = {};
      DAYS.forEach((d) => {
        o[d] = d === "Monday";
      });
      return o;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label.trim()) {
      // toast.error("Label is required");
      alert("Label is required");
      return;
    }

    // Collect all filled rows
    const payloads = [];
    DAYS.forEach((day) => {
      rowsByDay[day].forEach((row) => {
        const { startedAt, endedAt, classId, location, instructorId } = row;
        const hasAny =
          startedAt || endedAt || classId || location || instructorId;
        const isComplete =
          startedAt && endedAt && classId && location && instructorId;

        if (hasAny && !isComplete) {
          // partially filled row – block submit
          // toast.error(`Please complete all fields for ${day}`);
          throw new Error(`Please complete all fields for ${day}`);
        }

        if (isComplete) {
          payloads.push({
            label: label.trim(),
            active,
            dayName: day,
            startedAt,
            endedAt,
            classId,
            location,
            instructorId,
          });
        }
      });
    });

    if (!payloads.length) {
      alert("Add at least one schedule row");
      return;
    }

    try {
      setLoading(true);
      await Promise.all(
        payloads.map((p) =>
          axios.post(`${BASE_URL}/days-template/add`, p, {
            withCredentials: true,
          })
        )
      );
      // toast.success("Template created successfully");
      alert("Template created successfully");
      navigate("/adminDashboard/days-templates");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create template";
      // toast.error(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-10 text-sm text-gray-800 dark:text-gray-100"
    >
      {/* GENERAL INFORMATION CARD */}
      <div className="bg-white dark:bg-[#111218] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">General information</h2>

        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Label<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Morning weekday template"
            />
          </div>

          {/* Active */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-xs font-medium">Active</span>
          </label>
        </div>
      </div>

      {/* TEMPLATE SCHEDULES CARD */}
      <div className="bg-white dark:bg-[#111218] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Template schedules</h2>
          <p className="text-xs text-gray-500 mt-1">
            Template class schedules will be used to change bulk week class
            schedules.
          </p>
        </div>

        {/* PER-DAY SECTIONS */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {DAYS.map((day) => {
            const rows = rowsByDay[day];
            const isOpen = openDay[day];

            return (
              <div key={day} className="py-3">
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{day}</div>

                  {/* Right side: day actions & toggle */}
                  <div className="flex items-center gap-2">
                    {/* Add row for this day */}
                    <button
                      type="button"
                      onClick={() => addRow(day)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                      title="Add row"
                    >
                      <FiPlus className="text-sm" />
                    </button>

                    {/* Collapse/expand */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDay((prev) => ({
                          ...prev,
                          [day]: !prev[day],
                        }))
                      }
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                    >
                      {isOpen ? (
                        <FiChevronUp className="text-sm" />
                      ) : (
                        <FiChevronDown className="text-sm" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Table header + rows */}
                {isOpen && (
                  <div className="mt-3">
                    {/* Header row */}
                    <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-semibold bg-gray-100 dark:bg-[#181920] rounded-md px-3 py-2 mb-2">
                      <div className="col-span-2">Start at</div>
                      <div className="col-span-2">End at</div>
                      <div className="col-span-3">Class</div>
                      <div className="col-span-3">Location</div>
                      <div className="col-span-2">Instructor</div>
                    </div>

                    {/* Data rows */}
                    {rows.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        No schedules for this day. Click + to add one.
                      </p>
                    )}

                    <div className="space-y-2">
                      {rows.map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-[#181920] rounded-md px-3 py-3"
                        >
                          {/* Start time */}
                          <div className="md:col-span-2">
                            <label className="md:hidden text-[11px] text-gray-500">
                              Start at
                            </label>
                            <input
                              type="time"
                              value={row.startedAt}
                              onChange={(e) =>
                                handleRowChange(
                                  day,
                                  idx,
                                  "startedAt",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c]"
                            />
                          </div>

                          {/* End time */}
                          <div className="md:col-span-2">
                            <label className="md:hidden text-[11px] text-gray-500">
                              End at
                            </label>
                            <input
                              type="time"
                              value={row.endedAt}
                              onChange={(e) =>
                                handleRowChange(
                                  day,
                                  idx,
                                  "endedAt",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c]"
                            />
                          </div>

                          {/* Class select */}
                          <div className="md:col-span-3">
                            <label className="md:hidden text-[11px] text-gray-500">
                              Class
                            </label>
                            <select
                              value={row.classId}
                              onChange={(e) =>
                                handleRowChange(
                                  day,
                                  idx,
                                  "classId",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c]"
                            >
                              <option value="">Select class</option>
                              {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.className || c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Location select */}
                          <div className="md:col-span-3">
                            <label className="md:hidden text-[11px] text-gray-500">
                              Location
                            </label>
                            <select
                              value={row.location}
                              onChange={(e) =>
                                handleRowChange(
                                  day,
                                  idx,
                                  "location",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c]"
                            >
                              <option value="">Select location</option>
                              {locations.map((l) => (
                                <option key={l._id} value={l._id}>
                                  {l.locationName || l.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Instructor select + delete */}
                          <div className="md:col-span-2 flex items-center gap-2">
                            <div className="flex-1">
                              <label className="md:hidden text-[11px] text-gray-500">
                                Instructor
                              </label>
                              <select
                                value={row.instructorId}
                                onChange={(e) =>
                                  handleRowChange(
                                    day,
                                    idx,
                                    "instructorId",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c]"
                              >
                                <option value="">Select instructor</option>
                                {instructors.map((ins) => (
                                  <option key={ins._id} value={ins._id}>
                                    {ins.firstName
                                      ? `${ins.firstName} ${ins.lastName || ""}`
                                      : ins.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeRow(day, idx)}
                              className="mt-4 md:mt-0 inline-flex items-center justify-center h-8 w-8 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateDaysTemplates;
