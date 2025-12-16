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
  const [selected, setSelected] = useState([]);

  const [filters, setFilters] = useState({
    className: "",
    dayName: "",
    fromDate: "",
    toDate: "",
  });

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

  const handleDatesSet = async (info) => {
    setLoading(true);
    const midDate = dayjs(info.start).add(7, "day");
    const list = await fetchMonthData(
      midDate.format("YYYY"),
      midDate.format("MMMM")
    );
    setEvents(list);
    setFilteredEvents(list);
    setSelected([]);
    setLoading(false);
  };

  const handleDateClick = (info) => {
    const clickedDate = dayjs(info.dateStr);
    setFilters({ className: "", dayName: "", fromDate: "", toDate: "" });
    setSelected([]);
    setFilteredEvents(
      events.filter((e) => dayjs(e.start).isSame(clickedDate, "day"))
    );
  };

  const applyFilters = async () => {
    setLoading(true);
    let baseEvents = [...events];

    if (filters.fromDate && filters.toDate) {
      const months = getMonthsBetween(filters.fromDate, filters.toDate);
      for (const m of months) {
        const exists = baseEvents.some(
          (e) =>
            dayjs(e.start).format("YYYY-MM") ===
            dayjs(`${m.year}-${m.month}-01`).format("YYYY-MM")
        );
        if (!exists) {
          const more = await fetchMonthData(m.year, m.month);
          baseEvents.push(...more);
        }
      }
    }

    let list = [...baseEvents];

    if (filters.className)
      list = list.filter((e) =>
        e.title.toLowerCase().includes(filters.className.toLowerCase())
      );

    if (filters.dayName)
      list = list.filter(
        (e) => dayjs(e.start).format("dddd") === filters.dayName
      );

    if (filters.fromDate)
      list = list.filter((e) =>
        dayjs(e.start).isSameOrAfter(filters.fromDate, "day")
      );

    if (filters.toDate)
      list = list.filter((e) =>
        dayjs(e.start).isSameOrBefore(filters.toDate, "day")
      );

    setEvents(baseEvents);
    setFilteredEvents(list);
    setSelected([]);
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({ className: "", dayName: "", fromDate: "", toDate: "" });
    setFilteredEvents(events);
    setSelected([]);
  };

  const getClassCount = (date) =>
    events.filter((e) => dayjs(e.start).isSame(date, "day")).length;

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none";

  return (
    <div className="space-y-6 pb-10">
      <style>
        {`
  .fc {
    font-size: 10px;
  }

  .fc .fc-daygrid-day-number {
    font-size: 12px;
  }

  .fc .fc-toolbar-title {
    font-size: 16px;
  }

  .fc .fc-button {
    padding: 4px 8px;
    font-size: 12px;
  }
`}
      </style>

      {/* TOP */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Class Schedule
        </h2>

        <div className="grid grid-cols-12 gap-6">
          {/* CALENDAR */}
          {/* CALENDAR */}
          <div className="col-span-7 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
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
                      <span className="mt-1 px-2 text-xs rounded bg-black text-white dark:bg-white dark:text-black">
                        {count} class{count > 1 ? "es" : ""}
                      </span>
                    )}
                  </div>
                );
              }}
              height={420}
            />
          </div>

          {/* FILTERS */}
          <div className="col-span-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>

            <input className={inputClass} placeholder="Class name" />
            <select className={inputClass}>
              <option>All Days</option>
            </select>
            <input type="date" className={inputClass} />
            <input type="date" className={inputClass} />

            <button
              onClick={applyFilters}
              className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
            >
              Apply Filters
            </button>

            <button className="w-full py-2 rounded-lg bg-green-600 text-white">
              Book Class
            </button>

            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* FILTERED DATA */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={
              selected.length === filteredEvents.length &&
              filteredEvents.length > 0
            }
            onChange={(e) =>
              setSelected(
                e.target.checked ? filteredEvents.map((_, i) => i) : []
              )
            }
          />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Select All
          </span>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((e, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center px-5 py-4 rounded-lg bg-gray-100 dark:bg-[#1a1b22] border border-gray-200 dark:border-gray-700"
            >
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selected.includes(i)}
                  onChange={() =>
                    setSelected((prev) =>
                      prev.includes(i)
                        ? prev.filter((x) => x !== i)
                        : [...prev, i]
                    )
                  }
                />
              </div>

              <div className="col-span-3 font-semibold text-gray-900 dark:text-gray-100">
                {e.title}
              </div>

              <div className="col-span-5 text-center text-sm text-gray-600 dark:text-gray-300">
                {dayjs(e.start).format("DD MMM YYYY, dddd")}
              </div>

              <div className="col-span-3 text-right text-sm text-gray-600 dark:text-gray-300">
                Time: {dayjs(e.start).format("HH:mm")} –{" "}
                {e.end ? dayjs(e.end).format("HH:mm") : "--"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="text-xs text-gray-400">Loading…</div>}
    </div>
  );
};

export default BookClass;
