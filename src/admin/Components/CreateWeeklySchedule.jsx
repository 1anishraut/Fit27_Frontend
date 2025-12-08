// src/admin/Classes/WeeksSchedulesEditor.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BASE_URL } from "../../Utils/Constants";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Get all calendar weeks (Mon–Sun) that touch the given month
const getWeeksForMonth = (year, monthIndex) => {
  const firstOfMonth = dayjs().year(year).month(monthIndex).date(1);
  const lastOfMonth = firstOfMonth.endOf("month");

  // Start from Monday of the first display week
  let weekStart = firstOfMonth;
  if (weekStart.day() !== 1) {
    // day() 0=Sun,1=Mon,... so go to previous Monday
    weekStart = weekStart.startOf("week").add(1, "day");
  }

  const weeks = [];
  let i = 1;

  while (
    weekStart.isBefore(lastOfMonth) ||
    weekStart.isSame(lastOfMonth, "day")
  ) {
    const weekEnd = weekStart.add(6, "day");
    weeks.push({
      key: `week${i}`,
      index: i,
      startDate: weekStart.format("DD/MM/YYYY"),
      endDate: weekEnd.format("DD/MM/YYYY"),
    });

    weekStart = weekStart.add(7, "day");
    i++;
    if (i > 4) break; // only 4 weeks as per schema
  }

  return weeks;
};

const WeeksSchedulesEditor = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(dayjs().format("MMMM"));

  const [daysTemplates, setDaysTemplates] = useState([]);
  const [monthDocId, setMonthDocId] = useState(null);
  const [weeks, setWeeks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(null);

  const yearOptions = useMemo(() => {
    const arr = [];
    for (let y = currentYear - 1; y <= currentYear + 2; y++) {
      arr.push(y.toString());
    }
    return arr;
  }, [currentYear]);

  /* ============================
      FETCH DAYS TEMPLATES
  ============================ */
  const fetchDaysTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/days-template/all`, {
        withCredentials: true,
      });

      const raw = res.data?.data;
      let list = [];

      // In case backend ever returns grouped object, normalize to flat list
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && typeof raw === "object") {
        list = Object.values(raw).flat().filter(Boolean);
      }

      setDaysTemplates(list);
    } catch (err) {
      console.error("Failed to load Days Templates:", err);
    }
  };

  /* ============================
      FETCH MONTH TEMPLATE
      GET /month-template?year=YYYY&month=MMMM
  ============================ */
  const fetchMonthTemplate = async (selectedYear, selectedMonth) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/month-template/create`, {
        params: { year: selectedYear, month: selectedMonth },
        withCredentials: true,
      });

      const doc = res.data?.data || null;

      const baseWeeks = getWeeksForMonth(
        Number(selectedYear),
        MONTHS.indexOf(selectedMonth)
      );

      if (!doc) {
        // No document yet → use computed weeks, empty template selection
        const mapped = baseWeeks.map((w) => ({
          ...w,
          templateId: "",
        }));
        setWeeks(mapped);
        setMonthDocId(null);
      } else {
        setMonthDocId(doc._id);

        const mapped = baseWeeks.map((w) => {
          const block = doc[w.key]; // week1, week2, week3, week4
          let templateId = "";

          if (block?.template) {
            // template may be ObjectId string or populated object
            if (typeof block.template === "string") {
              templateId = block.template;
            } else if (typeof block.template === "object") {
              templateId = block.template._id;
            }
          }

          const startDate = block?.startDate || w.startDate;
          const endDate = block?.endDate || w.endDate;

          return {
            ...w,
            templateId,
            startDate,
            endDate,
          };
        });

        setWeeks(mapped);
      }
    } catch (err) {
      console.error("Failed to load Month Template:", err);

      // Fallback: just show computed weeks
      const baseWeeks = getWeeksForMonth(
        Number(selectedYear),
        MONTHS.indexOf(selectedMonth)
      ).map((w) => ({ ...w, templateId: "" }));
      setWeeks(baseWeeks);
      setMonthDocId(null);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
      INIT
  ============================ */
  useEffect(() => {
    fetchDaysTemplates();
  }, []);

  useEffect(() => {
    fetchMonthTemplate(year, month);
  }, [year, month]);

  /* ============================
      HANDLERS
  ============================ */
  const handleTemplateChange = (weekKey, value) => {
    setWeeks((prev) =>
      prev.map((w) => (w.key === weekKey ? { ...w, templateId: value } : w))
    );
  };

  const handleSave = async () => {
    // enforce at least ONE week has template assigned
    const hasAtLeastOne = weeks.some((w) => w.templateId);
    if (!hasAtLeastOne) {
      alert("Assign at least one week template before saving.");
      return;
    }

    setSaving(true);

    const body = { year, month };

    weeks.forEach((w) => {
      body[w.key] = {
        template: w.templateId || null,
        startDate: w.startDate,
        endDate: w.endDate,
      };
    });

    try {
      if (monthDocId) {
        await axios.patch(
          `${BASE_URL}/month-template/update/${monthDocId}`,
          body,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${BASE_URL}/month-template/create`, body, {
          withCredentials: true,
        });
      }

      alert("Week schedules updated successfully");
    } catch (err) {
      console.error("Save failed:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to save week schedules"
      );
    } finally {
      setSaving(false);
    }
  };

  const containerClass =
    "p-6 min-h-screen bg-gray-100 dark:bg-[#09090B] transition-colors";

  return (
    <div className={containerClass}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiCalendar />
          Edit Weeks Schedules
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
        >
          Close
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-[#111118] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-w-3xl mx-auto">
        {/* TOP CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
          {/* Year select */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month select */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* WARNING BANNER */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-yellow-50 dark:bg-[#2b2110] flex gap-3">
          <div className="mt-1 text-yellow-600 dark:text-yellow-400">⚠</div>
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            Be careful when assigning templates. If you remove or change a
            week&apos;s template, all data attached to that week will be treated
            as a new week. For day-level changes, use the &quot;Week
            Schedules&quot; / days templates section.
          </p>
        </div>

        {/* WEEKS LIST */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
              Loading weeks…
            </div>
          ) : (
            weeks.map((week) => {
              const isOpen = expandedWeek === week.key;

              return (
                <div
                  key={week.key}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-[#151519]"
                >
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedWeek((prev) =>
                        prev === week.key ? null : week.key
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs">
                        {week.index}
                      </span>
                      <span>
                        {week.startDate} – {week.endDate}
                      </span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-300">
                      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>

                  {/* Row body */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#14151c]">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Assign Days Template
                      </label>
                      <select
                        value={week.templateId}
                        onChange={(e) =>
                          handleTemplateChange(week.key, e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#181920] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      >
                        <option value="">-- Select template --</option>
                        {daysTemplates.map((tpl) => (
                          <option key={tpl._id} value={tpl._id}>
                            {tpl.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#151519]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-black text-white text-xs dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeksSchedulesEditor;
