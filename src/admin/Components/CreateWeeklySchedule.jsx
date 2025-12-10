import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
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

// compute exactly 4 weeks
const getWeeksForMonth = (year, monthIndex) => {
  const first = dayjs().year(year).month(monthIndex).date(1);

  let weekStart = first;
  if (weekStart.day() !== 1) {
    weekStart = weekStart.startOf("week").add(1, "day");
  }

  const weeks = [];
  for (let i = 1; i <= 4; i++) {
    weeks.push({
      key: `week${i}`,
      index: i,
      startDate: weekStart.format("DD/MM/YYYY"),
      endDate: weekStart.add(6, "day").format("DD/MM/YYYY"),
    });
    weekStart = weekStart.add(7, "day");
  }

  return weeks;
};

export default function WeeksSchedulesEditor() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(dayjs().format("MMMM"));

  const [daysTemplates, setDaysTemplates] = useState([]); // ONLY active templates
  const [weeks, setWeeks] = useState([]);
  const [monthDocId, setMonthDocId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const yearOptions = useMemo(() => {
    return [
      (currentYear - 2).toString(),
      (currentYear - 1).toString(),
      currentYear.toString(),
      (currentYear + 1).toString(),
      (currentYear + 2).toString(),
      (currentYear + 3).toString(),
    ];
  }, [currentYear]);

  /* ------------------------------------------------
      LOAD ACTIVE TEMPLATES ONLY
  ------------------------------------------------ */
  const fetchActiveTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/days-template/active`, {
        withCredentials: true,
      });

      setDaysTemplates(res.data?.data || []);
    } catch (err) {
      console.error("Error loading active templates:", err);
      setDaysTemplates([]);
    }
  };

  /* ------------------------------------------------
      LOAD MONTH TEMPLATE
  ------------------------------------------------ */
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
        // No month template exists
        setMonthDocId(null);

        const wk = baseWeeks.map((w) => ({ ...w, templateId: "" }));
        setWeeks(wk);
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
      console.error("Month load failed:", err);

      const wk = getWeeksForMonth(Number(year), MONTHS.indexOf(month)).map(
        (w) => ({ ...w, templateId: "" })
      );
      setWeeks(wk);
    }

    setLoading(false);
  };

  /* ------------------------------------------------
      LOADS
  ------------------------------------------------ */
  useEffect(() => {
    fetchActiveTemplates();
  }, []);

  useEffect(() => {
    fetchMonthTemplate(year, month);
  }, [year, month]);

  /* ------------------------------------------------
      CHANGE TEMPLATE
  ------------------------------------------------ */
  const handleTemplateChange = (weekKey, value) => {
    setWeeks((prev) =>
      prev.map((w) => (w.key === weekKey ? { ...w, templateId: value } : w))
    );
  };

  /* ------------------------------------------------
      SAVE MONTH TEMPLATE
  ------------------------------------------------ */
  const handleSave = async () => {
    const hasAny = weeks.some((w) => w.templateId);
    if (!hasAny) return alert("Assign at least one template.");

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
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs"
        >
          Close
        </button>
      </div>

      {/* BODY CARD */}
      <div className="bg-white dark:bg-[#111118] rounded-xl border border-gray-300 dark:border-gray-700 max-w-4xl mx-auto shadow-lg">
        {/* YEAR + MONTH SELECT */}
        <div className="flex gap-4 p-6 border-b dark:border-gray-700">
          <div className="flex-1">
            <label className="text-xs font-medium">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {yearOptions.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* WEEKS */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center text-xs">Loading...</div>
          ) : (
            weeks.map((week) => (
              <div
                key={week.key}
                className="flex items-center gap-8 border rounded-lg px-4 py-3 bg-gray-50 dark:bg-[#151519]"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-xs">
                  {week.index}
                </span>

                <div>
                  <span className="text-xs text-gray-500">Start Date</span>
                  <div className="text-sm">{week.startDate}</div>
                </div>

                <div>
                  <span className="text-xs text-gray-500">End Date</span>
                  <div className="text-sm">{week.endDate}</div>
                </div>

                <div className="flex-1 pl-20">
                  <label className="text-xs">Assign Template</label>
                  <select
                    value={week.templateId}
                    onChange={(e) =>
                      handleTemplateChange(week.key, e.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                  >
                    <option value="">-- Select Template --</option>

                    {daysTemplates.map((tpl) => (
                      <option key={tpl._id} value={tpl._id}>
                        {tpl.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-black text-white rounded-lg text-xs disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
