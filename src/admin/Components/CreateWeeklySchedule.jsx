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

// compute exactly 4 visible weeks for the UI
const getWeeksForMonth = (year, monthIndex) => {
  const first = dayjs().year(year).month(monthIndex).date(1);
  const last = first.endOf("month");

  let weekStart = first;
  if (weekStart.day() !== 1) {
    weekStart = weekStart.startOf("week").add(1, "day");
  }

  const weeks = [];
  let i = 1;

  while (
    (weekStart.isBefore(last) || weekStart.isSame(last, "day")) &&
    i <= 4
  ) {
    weeks.push({
      key: `week${i}`,
      index: i,
      startDate: weekStart.format("DD/MM/YYYY"),
      endDate: weekStart.add(6, "day").format("DD/MM/YYYY"),
    });

    weekStart = weekStart.add(7, "day");
    i++;
  }

  return weeks;
};

export default function WeeksSchedulesEditor() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(dayjs().format("MMMM"));

  const [daysTemplates, setDaysTemplates] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [monthDocId, setMonthDocId] = useState(null);

  const [expandedWeek, setExpandedWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const yearOptions = useMemo(() => {
    return [
      (currentYear - 1).toString(),
      currentYear.toString(),
      (currentYear + 1).toString(),
      (currentYear + 2).toString(),
    ];
  }, [currentYear]);

  /* ---------------------------
      LOAD ONLY ACTIVE TEMPLATES
  ---------------------------- */
  const fetchDaysTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/days-template/active`, {
        withCredentials: true,
      });

      // Ensure only active templates appear in dropdown
      const activeOnly = (res.data?.data || []).filter(
        (tpl) => tpl.active === true
      );

      setDaysTemplates(activeOnly);
      console.log("Active Templates Loaded:", activeOnly);
    } catch (err) {
      console.error("Failed to load templates:", err);
    }
  };

  /* ---------------------------
      LOAD EXISTING MONTH TEMPLATE
  ---------------------------- */
  const fetchMonthTemplate = async (year, month) => {
    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/month-template`, {
        params: { year, month },
        withCredentials: true,
      });

      const doc = res.data?.data;
      const baseWeeks = getWeeksForMonth(Number(year), MONTHS.indexOf(month));

      if (!doc) {
        setMonthDocId(null);
        setWeeks(baseWeeks.map((w) => ({ ...w, templateId: "" })));
      } else {
        setMonthDocId(doc._id);

        const mapped = baseWeeks.map((w) => {
          const block = doc[w.key];

          let templateId = "";
          if (block?.template) {
            templateId =
              typeof block.template === "string"
                ? block.template
                : block.template._id;
          }

          return {
            ...w,
            templateId,
            startDate: block?.startDate || w.startDate,
            endDate: block?.endDate || w.endDate,
          };
        });

        setWeeks(mapped);
      }
    } catch (err) {
      console.error("Failed to load month template:", err);
      const baseWeeks = getWeeksForMonth(
        Number(year),
        MONTHS.indexOf(month)
      ).map((w) => ({ ...w, templateId: "" }));
      setWeeks(baseWeeks);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDaysTemplates();
  }, []);

  useEffect(() => {
    fetchMonthTemplate(year, month);
  }, [year, month]);

  /* ---------------------------
      UPDATE SELECTED TEMPLATE
  ---------------------------- */
  const handleTemplateChange = (weekKey, value) => {
    setWeeks((prev) =>
      prev.map((w) => (w.key === weekKey ? { ...w, templateId: value } : w))
    );
  };

  /* ---------------------------
      SAVE TO BACKEND
  ---------------------------- */
  const handleSave = async () => {
    const hasAny = weeks.some((w) => w.templateId);
    if (!hasAny) {
      alert("Assign at least one template.");
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

      alert("Updated successfully");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save");
    }

    setSaving(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-[#09090B]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiCalendar /> Edit Weeks Schedules
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 border rounded-lg text-xs dark:border-gray-700"
        >
          Close
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-[#111118] rounded-xl border shadow-lg max-w-3xl mx-auto">
        {/* YEAR + MONTH SELECT */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b">
          <div className="flex-1">
            <label className="text-xs text-gray-600 dark:text-gray-300">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c]"
            >
              {yearOptions.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs text-gray-600 dark:text-gray-300">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#14151c]"
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* WEEKS */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center text-xs">Loading...</div>
          ) : (
            weeks.map((week) => {
              const isOpen = expandedWeek === week.key;
              return (
                <div
                  key={week.key}
                  className="border rounded-lg bg-gray-50 dark:bg-[#151519]"
                >
                  <button
                    onClick={() => setExpandedWeek(isOpen ? null : week.key)}
                    className="w-full flex justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-xs">
                        {week.index}
                      </span>
                      <span>
                        {week.startDate} – {week.endDate}
                      </span>
                    </div>
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t dark:border-gray-700">
                      <label className="text-xs text-gray-600 dark:text-gray-300">
                        Assign Days Template
                      </label>
                      <select
                        value={week.templateId}
                        onChange={(e) =>
                          handleTemplateChange(week.key, e.target.value)
                        }
                        className="w-full border rounded-lg px-3 py-2 mt-1 text-sm bg-white dark:bg-[#181920]"
                      >
                        <option value="">-- Select Template --</option>
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

        {/* SAVE BUTTON */}
        <div className="p-4 border-t flex justify-end bg-gray-50 dark:bg-[#151519]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-black text-white text-xs rounded-lg dark:bg:white dark:text:black"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
