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
  const p1 = dayjs(d, "DD/MM/YYYY", true);
  if (p1.isValid()) return p1.format("YYYY-MM-DD");
  const p2 = dayjs(d, "YYYY-MM-DD", true);
  if (p2.isValid()) return p2.format("YYYY-MM-DD");
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
     FETCH ONE MONTH (UNCHANGED LOGIC)
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
    const midDate = dayjs(info.start).add(7, "day");
    const list = await fetchMonthData(
      midDate.format("YYYY"),
      midDate.format("MMMM")
    );
    setEvents(list);
    setFilteredEvents(list);
    setLoading(false);
  };

  /* ----------------------------------
     DATE CLICK (UNCHANGED)
  ---------------------------------- */

  const handleDateClick = (info) => {
    const clickedDate = dayjs(info.dateStr);

    setFilters({
      className: "",
      dayName: "",
      fromDate: "",
      toDate: "",
    });

    const list = events.filter((e) =>
      dayjs(e.start).isSame(clickedDate, "day")
    );

    setFilteredEvents(list);
  };

  /* ----------------------------------
     APPLY FILTERS (🔥 ONLY ENHANCED PART)
  ---------------------------------- */

  const applyFilters = async () => {
    setLoading(true);
    let baseEvents = [...events];

    // 🔥 Fetch missing months ONLY when date range is used
    if (filters.fromDate && filters.toDate) {
      const months = getMonthsBetween(filters.fromDate, filters.toDate);

      for (const m of months) {
        const alreadyLoaded = baseEvents.some(
          (e) =>
            dayjs(e.start).format("YYYY-MM") ===
            dayjs(`${m.year}-${m.month}-01`).format("YYYY-MM")
        );

        if (!alreadyLoaded) {
          const newEvents = await fetchMonthData(m.year, m.month);
          baseEvents.push(...newEvents);
        }
      }
    }

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
     CLEAR FILTERS (UNCHANGED)
  ---------------------------------- */

  const clearFilters = () => {
    setFilters({
      className: "",
      dayName: "",
      fromDate: "",
      toDate: "",
    });
    setFilteredEvents(events);
  };

  /* ----------------------------------
     COUNT CLASSES PER DAY (UNCHANGED)
  ---------------------------------- */

  const getClassCount = (date) =>
    events.filter((e) => dayjs(e.start).isSame(date, "day")).length;

  /* ----------------------------------
     UI (UNCHANGED)
  ---------------------------------- */

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111218]">
      <h1 className="text-xl font-semibold">Class Schedule</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* CALENDAR */}
        <div className="col-span-9 border rounded p-3">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            events={events}
            eventDisplay="none"
            selectable
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
            dayCellContent={(info) => {
              const count = getClassCount(info.date);
              return (
                <div className="flex flex-col items-end">
                  <span>{info.dayNumberText}</span>
                  {count > 0 && (
                    <span className="mt-1 px-2 py-[2px] text-xs rounded bg-blue-600 text-white">
                      {count} class{count > 1 ? "es" : ""}
                    </span>
                  )}
                </div>
              );
            }}
            height="auto"
          />
        </div>

        {/* FILTERS */}
        <div className="col-span-3 border rounded p-4 space-y-3">
          <h3 className="font-medium">Filters</h3>

          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Class name"
            value={filters.className}
            onChange={(e) =>
              setFilters({ ...filters, className: e.target.value })
            }
          />

          <select
            className="w-full border rounded px-2 py-1"
            value={filters.dayName}
            onChange={(e) =>
              setFilters({ ...filters, dayName: e.target.value })
            }
          >
            <option value="">All Days</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
          />

          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          />

          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-1 rounded"
          >
            Apply Filters
          </button>

          <button onClick={clearFilters} className="w-full border py-1 rounded">
            Clear Filters
          </button>
        </div>
      </div>

      {/* FILTERED DATA */}
      <div className="border rounded p-4">
        <h3 className="font-medium mb-3">Filtered Data</h3>

        {filteredEvents.length === 0 && (
          <p className="text-gray-400">No classes found</p>
        )}

        {filteredEvents.map((e, i) => (
          <div key={i} className="border-b py-2">
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-gray-500">
              {dayjs(e.start).format("DD MMM YYYY, dddd")} •{" "}
              {dayjs(e.start).format("HH:mm")}
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="text-sm text-gray-400">Loading…</div>}
    </div>
  );
};

export default BookClass;
