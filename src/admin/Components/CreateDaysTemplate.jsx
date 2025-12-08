// src/admin/Classes/CreateDaysTemplates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utils/Constants";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";

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

const CreateDaysSchedule = () => {
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [active, setActive] = useState(true);

  // One default row for each day
  const [rowsByDay, setRowsByDay] = useState(() => {
    const obj = {};
    DAYS.forEach((d) => {
      obj[d] = [{ ...emptyRow }];
    });
    return obj;
  });

  // Only Monday open initially
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

  // Fetch dropdown lists
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const clsReq = axios.get(`${BASE_URL}/classes/all`, {
          withCredentials: true,
        });
        const locReq = axios.get(`${BASE_URL}/location/all`, {
          withCredentials: true,
        });
        const instReq = axios.get(`${BASE_URL}/instructor/all`, {
          withCredentials: true,
        });

        const [clsRes, locRes, instRes] = await Promise.all([
          clsReq,
          locReq,
          instReq,
        ]);

        setClasses(clsRes.data.data || []);
        setLocations(locRes.data.data || []);
        setInstructors(instRes.data.data || []);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
        alert("Failed to load classes / locations / instructors");
      }
    };

    fetchAll();
  }, []);

  // Add & remove row
  const addRow = (day) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...emptyRow }],
    }));
  };

  const removeRow = (day, index) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleRowChange = (day, index, field, value) => {
    setRowsByDay((prev) => {
      const copy = { ...prev };
      copy[day][index][field] = value;
      return copy;
    });
  };

  // Reset form
  const resetForm = () => {
    setLabel("");
    setActive(true);

    const obj = {};
    DAYS.forEach((d) => {
      obj[d] = [{ ...emptyRow }];
    });
    setRowsByDay(obj);

    const o = {};
    DAYS.forEach((d) => {
      o[d] = d === "Monday";
    });
    setOpenDay(o);
  };

  // Submit template
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    let daysPayload = {};

    // Validate and build final days object
    for (let day of DAYS) {
      const rows = rowsByDay[day];
      let filtered = [];

      for (let row of rows) {
        const { startedAt, endedAt, classId, location, instructorId } = row;

        const hasAny =
          startedAt || endedAt || classId || location || instructorId;
        const isComplete =
          startedAt && endedAt && classId && location && instructorId;

        if (hasAny && !isComplete) {
          alert(`Please complete all fields for ${day}`);
          return;
        }

        if (isComplete) filtered.push(row);
      }

      daysPayload[day] = filtered;
    }

    const finalPayload = {
      label,
      active,
      days: daysPayload,
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/days-template/add`, finalPayload, {
        withCredentials: true,
      });

      alert("Template created successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to create template"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

  const selectClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10 text-sm">
      {/* GENERAL INFO */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Add New Days Schedule 
        </h2>

        {/* FLEX ROW */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* LABEL INPUT */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Label <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`
          w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm 
          bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
        `}
              placeholder="Morning weekday template"
            />
          </div>

          {/* TOGGLE SWITCH */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Active
            </span>

            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`
          relative inline-flex h-6 w-11 items-center rounded-full 
          transition 
          ${active ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"}
        `}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition 
            ${active ? "translate-x-6" : "translate-x-1"}
          `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* TEMPLATE SCHEDULES */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Template Schedules
        </h2>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {DAYS.map((day) => {
            const rows = rowsByDay[day];
            const isOpen = openDay[day];

            return (
              <div key={day} className="py-3">
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                    {day}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addRow(day)}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                    >
                      <FiPlus />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenDay((prev) => ({ ...prev, [day]: !prev[day] }))
                      }
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                    >
                      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Day rows */}
                {isOpen && (
                  <div className="mt-3 space-y-2">
                    {/* Desktop header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-semibold bg-gray-100 dark:bg-[#181920] p-2 rounded">
                      <div className="col-span-2">Start</div>
                      <div className="col-span-2">End</div>
                      <div className="col-span-3">Class</div>
                      <div className="col-span-3">Location</div>
                      <div className="col-span-2">Instructor</div>
                    </div>

                    {rows.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-[#181920] rounded-md p-3"
                      >
                        {/* Start time */}
                        <div className="md:col-span-2">
                          <label className="md:hidden text-xs text-gray-500">
                            Start
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
                            className={inputClass}
                          />
                        </div>

                        {/* End time */}
                        <div className="md:col-span-2">
                          <label className="md:hidden text-xs text-gray-500">
                            End
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
                            className={inputClass}
                          />
                        </div>

                        {/* Class */}
                        <div className="md:col-span-3">
                          <label className="md:hidden text-xs text-gray-500">
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
                            className={selectClass}
                          >
                            <option value="">Select Class</option>
                            {classes.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-3">
                          <label className="md:hidden text-xs text-gray-500">
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
                            className={selectClass}
                          >
                            <option value="">Select Location</option>
                            {locations.map((l) => (
                              <option key={l._id} value={l._id}>
                                {l.locationName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Instructor */}
                        <div className="md:col-span-2 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="md:hidden text-xs text-gray-500">
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
                              className={selectClass}
                            >
                              <option value="">Select Instructor</option>
                              {instructors.map((ins) => (
                                <option key={ins._id} value={ins._id}>
                                  {ins.firstName} {ins.surName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Delete row */}
                          <button
                            type="button"
                            onClick={() => removeRow(day, idx)}
                            className="h-8 w-8 rounded-full border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <FiTrash2 className="mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
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
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateDaysSchedule;
