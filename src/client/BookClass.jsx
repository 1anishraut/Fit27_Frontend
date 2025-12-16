import React, { useCallback, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import dayjs from "dayjs";

import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { BASE_URL } from "../Utils/Constants";

/* ----------------------------------
   DAYJS PLUGINS
---------------------------------- */
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/* ----------------------------------
   HELPERS (UNCHANGED)
---------------------------------- */

const normalizeDate = (d) => {
  if (!d) return null;
  return dayjs(d).format("YYYY-MM-DD");
};

const normalizeDayName = (d) => {
  const r = d.toLowerCase();
  if (r.startsWith("mon")) return "Monday";
  if (r.startsWith("tue")) return "Tuesday";
  if (r.startsWith("wed")) return "Wednesday";
  if (r.startsWith("thu")) return "Thursday";
  if (r.startsWith("fri")) return "Friday";
  if (r.startsWith("sat")) return "Saturday";
  if (r.startsWith("sun")) return "Sunday";
  return "";
};

const parseDateTime = (time, date) => {
  if (!time) return null;
  const combined = `${date} ${time}`;
  const dt = dayjs(combined, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD H:mm"], true);
  return dt.isValid() ? dt : null;
};

/* ----------------------------------
   NEW: GET MONTHS BETWEEN DATES
---------------------------------- */
const getMonthsBetween = (from, to) => {
  const months = [];
  let cursor = dayjs(from).startOf("month");

  while (cursor.isSameOrBefore(to, "month")) {
    months.push({
      year: cursor.format("YYYY"),
      month: cursor.format("MMMM"),
    });
    cursor = cursor.add(1, "month");
  }
  return months;
};

/* ----------------------------------
   COMPONENT
---------------------------------- */

const BookClass = () => {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    className: "",
    dayName: "",
    fromDate: "",
    toDate: "",
  });

  /* ----------------------------------
     FETCH MONTH DATA (UNCHANGED)
  ---------------------------------- */

  const fetchMonthData = useCallback(async (year, month) => {
    const res = await axios.get(`${BASE_URL}/month-template`, {
      params: { year, month },
      withCredentials: true,
    });

    const mt = res?.data?.data;
    if (!mt) return [];

    const weeks = ["week1", "week2", "week3", "week4", "week5"];
    const list = [];

    weeks.forEach((wk) => {
      const week = mt[wk];
      if (!week?.template) return;

      const start = dayjs(normalizeDate(week.startDate));
      const end = dayjs(normalizeDate(week.endDate));
      const days = week.template.days || {};

      Object.entries(days).forEach(([dayKey, rows]) => {
        const dayName = normalizeDayName(dayKey);
        if (!Array.isArray(rows)) return;

        rows.forEach((row) => {
          let cursor = start.clone();

          while (cursor.isSameOrBefore(end, "day")) {
            if (cursor.format("dddd") === dayName) {
              const dateOnly = cursor.format("YYYY-MM-DD");

              const sdt = parseDateTime(row.startedAt, dateOnly);
              const edt = parseDateTime(row.endedAt, dateOnly);

              list.push({
                title: row?.classId?.name || "Class",
                start: sdt ? sdt.toISOString() : dateOnly,
                end: edt ? edt.toISOString() : undefined,
              });
            }
            cursor = cursor.add(1, "day");
          }
        });
      });
    });

    return list;
  }, []);

  /* ----------------------------------
     CALENDAR MONTH CHANGE (UNCHANGED)
  ---------------------------------- */

  const handleDatesSet = async (info) => {
    setLoading(true);
    const mid = dayjs(info.start).add(7, "day");
    const list = await fetchMonthData(mid.format("YYYY"), mid.format("MMMM"));
    setEvents(list);
    setFilteredEvents(list);
    setLoading(false);
  };

  /* ----------------------------------
     APPLY FILTERS (🔥 ONLY FIXED PART)
  ---------------------------------- */

  const applyFilters = async () => {
    setLoading(true);
    let baseEvents = [...events];

    // 🔥 If date range exists, ensure future months are fetched
    if (filters.fromDate && filters.toDate) {
      const months = getMonthsBetween(filters.fromDate, filters.toDate);

      for (const m of months) {
        const exists = baseEvents.some(
          (e) =>
            dayjs(e.start).format("YYYY-MM") ===
            dayjs(`${m.year}-${m.month}-01`).format("YYYY-MM")
        );

        if (!exists) {
          const newEvents = await fetchMonthData(m.year, m.month);
          baseEvents.push(...newEvents);
        }
      }
    }

    // apply existing filters
    let list = [...baseEvents];

    if (filters.className) {
      list = list.filter((e) =>
        e.title.toLowerCase().includes(filters.className.toLowerCase())
      );
    }

    if (filters.dayName) {
      list = list.filter(
        (e) => dayjs(e.start).format("dddd") === filters.dayName
      );
    }

    if (filters.fromDate) {
      list = list.filter((e) =>
        dayjs(e.start).isSameOrAfter(filters.fromDate, "day")
      );
    }

    if (filters.toDate) {
      list = list.filter((e) =>
        dayjs(e.start).isSameOrBefore(filters.toDate, "day")
      );
    }

    setEvents(baseEvents); // keep calendar in sync
    setFilteredEvents(list);
    setLoading(false);
  };

  /* ----------------------------------
     UI (UNCHANGED)
  ---------------------------------- */

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111218]">
      <h1 className="text-xl font-semibold">Class Schedule</h1>

      {/* 🔹 EVERYTHING ELSE REMAINS SAME */}
      {/* Calendar, filters UI, clear button, count-only calendar,
          date click, etc. stay untouched */}

      {/* Your existing JSX continues here exactly as before */}
    </div>
  );
};

export default BookClass;
