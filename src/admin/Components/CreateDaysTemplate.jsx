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

const CreateDaysTemplates = () => {
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [active, setActive] = useState(true);

  // ✅ EVERY DAY STARTS WITH ONE EMPTY ROW
  const [rowsByDay, setRowsByDay] = useState(() => {
    const obj = {};
    DAYS.forEach((d) => {
      obj[d] = [{ ...emptyRow }]; // FIXED
    });
    return obj;
  });

  // Only Monday open by default
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

  // ===============================
  // FETCH CLASSES / LOCATIONS / INSTRUCTORS
  // ===============================
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
        console.error("Dropdown Load Error → ", err);
        alert("Failed to load Classes / Locations / Instructors");
      }
    };

    fetchAll();
  }, []);

  // ===============================
  // ADD / REMOVE ROWS
  // ===============================
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

  // ===============================
  // RESET FORM
  // ===============================
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

  // ===============================
  // SUBMIT HANDLER
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    const payloads = [];

    DAYS.forEach((day) => {
      rowsByDay[day].forEach((row) => {
        const { startedAt, endedAt, classId, location, instructorId } = row;

        const hasAny =
          startedAt || endedAt || classId || location || instructorId;

        const isComplete =
          startedAt && endedAt && classId && location && instructorId;

        if (hasAny && !isComplete) {
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

      alert("Template created successfully");
      navigate("/adminDashboard/days-templates");
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

  // ===============================
  // UI RETURN
  // ===============================
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-10 text-sm text-gray-800 dark:text-gray-100"
    >
      {/* =======================
          GENERAL INFORMATION
      ========================= */}
      <div className="bg-white dark:bg-[#111218] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">General information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c]"
              placeholder="Morning weekday template"
            />
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span className="text-xs font-medium">Active</span>
          </label>
        </div>
      </div>

      {/* =======================
          TEMPLATE SCHEDULES
      ========================= */}
      <div className="bg-white dark:bg-[#111218] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Template schedules</h2>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {DAYS.map((day) => {
            const rows = rowsByDay[day];
            const isOpen = openDay[day];

            return (
              <div key={day} className="py-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{day}</div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addRow(day)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700"
                    >
                      <FiPlus />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenDay((prev) => ({
                          ...prev,
                          [day]: !prev[day],
                        }))
                      }
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700"
                    >
                      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Rows */}
                {isOpen && (
                  <div className="mt-3">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-semibold bg-gray-100 dark:bg-[#181920] rounded-md px-3 py-2 mb-2">
                      <div className="col-span-2">Start at</div>
                      <div className="col-span-2">End at</div>
                      <div className="col-span-3">Class</div>
                      <div className="col-span-3">Location</div>
                      <div className="col-span-2">Instructor</div>
                    </div>

                    <div className="space-y-2">
                      {rows.map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50 dark:bg-[#181920] rounded-md px-3 py-3"
                        >
                          {/* Start time */}
                          <div className="md:col-span-2">
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
                              className="w-full border rounded-md px-2 py-1 text-xs"
                            />
                          </div>

                          {/* End time */}
                          <div className="md:col-span-2">
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
                              className="w-full border rounded-md px-2 py-1 text-xs"
                            />
                          </div>

                          {/* Class */}
                          <div className="md:col-span-3">
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
                              className="w-full border rounded-md px-2 py-1 text-xs"
                            >
                              <option value="">Select class</option>
                              {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.className}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Location */}
                          <div className="md:col-span-3">
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
                              className="w-full border rounded-md px-2 py-1 text-xs"
                            >
                              <option value="">Select location</option>
                              {locations.map((l) => (
                                <option key={l._id} value={l._id}>
                                  {l.locationName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Instructor */}
                          <div className="md:col-span-2 flex items-center gap-2">
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
                              className="w-full border rounded-md px-2 py-1 text-xs"
                            >
                              <option value="">Select instructor</option>
                              {instructors.map((ins) => (
                                <option key={ins._id} value={ins._id}>
                                  {ins.firstName} {ins.lastName}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => removeRow(day, idx)}
                              className="h-8 w-8 flex items-center justify-center rounded-full border border-red-300 text-red-500 hover:bg-red-50"
                            >
                              <FiTrash2 />
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

      {/* FOOTER */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 rounded-lg border text-xs"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateDaysTemplates;
