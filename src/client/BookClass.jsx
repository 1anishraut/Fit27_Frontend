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
import BookClassConfirmModal from "./Components/BookClassConfirmModal";

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
  const dt = dayjs(combined, ["YYYY-MM-DD HH:mm"], true);
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
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);


  const [filters, setFilters] = useState({
    className: "",
    dayName: "",
    fromDate: "",
    toDate: "",
  });

  /* ----------------------------------
     FETCH MONTH DATA 
  ---------------------------------- */
  const fetchMonthData = useCallback(async (year, month) => {
    const res = await axios.get(`${BASE_URL}/month-template`, {
      params: { year, month },
      withCredentials: true,
    });

    const mt = res?.data?.data;
    if (!mt) return [];

    const weeks = ["week1", "week2", "week3", "week4"];
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
                /* 🔑 REQUIRED FOR BOOKING */
                classId: row.classId?._id,
                instructorId: row.instructorId?._id,
                location: row.location?._id,
                date: dateOnly,
                startedAt: row.startedAt,
                endedAt: row.endedAt,
                month: dayjs(dateOnly).format("MMMM"),
                year: dayjs(dateOnly).format("YYYY"),

                /* 🎨 REQUIRED FOR UI */
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
     CALENDAR EVENTS
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
    setSelected([]);
    setLoading(false);
  };

  const handleDateClick = (info) => {
    const clickedDate = dayjs(info.dateStr);
    setFilters({ className: "", dayName: "", fromDate: "", toDate: "" });
    setFilteredEvents(
      events.filter((e) => dayjs(e.start).isSame(clickedDate, "day"))
    );
    setSelected([]);
  };

  /* ----------------------------------
     FILTERS (UNCHANGED)
  ---------------------------------- */
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
    "w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

  /* ----------------------------------
     BOOK CLASS
  ---------------------------------- */
  const handleBookClass = async () => {
    try {
      setBookingLoading(true);

      const selectedClasses = selected
        .map((idx) => filteredEvents[idx])
        .filter(Boolean);

      const payload = selectedClasses.map((c) => ({
        classId: c.classId,
        instructorId: c.instructorId,
        location: c.location,
        date: c.date,
        startedAt: c.startedAt,
        endedAt: c.endedAt,
        month: c.month,
        year: c.year,
      }));

      await axios.post(
        `${BASE_URL}/user/book-classes`,
        { classes: payload },
        { withCredentials: true }
      );

      alert("Classes booked successfully ✅");
      setSelected([]);
      setShowConfirm(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };


  return (
    <div className="space-y-6 pb-10">
      <style>
        {`
    /* 🔹 Make calendar cells smaller WITHOUT shrinking text */
    .fc .fc-daygrid-day-frame {
    // max-width: 24px;
      max-height: 74px;
         /* smaller cells */
      padding: 0px;       /* reduce inner spacing */
    }

    /* 🔹 Keep date text readable */
    .fc .fc-daygrid-day-number {
      font-size: 12px;    /* same as default */
      font-weight: 500;
    }

    /* 🔹 Ensure weekday headers visible in dark mode */
    .dark .fc .fc-col-header-cell {
      background: #111218 !important;
    }

    .dark .fc .fc-col-header-cell-cushion {
      color: #ffffff !important;
      opacity: 1 !important;
      font-weight: 600;
    }
  `}
      </style>

      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Class Schedule
        </h2>

        <div className="grid grid-cols-15 gap-6">
          {/* CALENDAR */}
          <div className="col-span-9 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
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
              height="auto"
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
            />
          </div>

          {/* FILTERS */}
          <div className="col-span-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>

            <input
              className={inputClass}
              placeholder="Class name"
              value={filters.className}
              onChange={(e) =>
                setFilters({ ...filters, className: e.target.value })
              }
            />

            <select
              className={inputClass}
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
                <option key={d}>{d}</option>
              ))}
            </select>

            <input
              type="date"
              className={inputClass}
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />

            <input
              type="date"
              className={inputClass}
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />

            <button
              onClick={applyFilters}
              className="w-full px-4 py-2 rounded-lg bg-black text-white text-xs dark:bg-white dark:text-black"
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-xs"
            >
              Clear Filters
            </button>
          </div>

          {/* SELECTED CLASSES */}
          <div className="col-span-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Selected Classes</h3>

            {selected.length === 0 && (
              <p className="text-xs text-gray-500">No class selected</p>
            )}

            {selected.map((idx) => {
              const e = filteredEvents[idx];
              if (!e) return null;

              return (
                <div
                  key={idx}
                  className="text-xs p-2 rounded border bg-gray-100 dark:bg-[#1a1b22]"
                >
                  <div className="font-semibold">{e.title}</div>
                  <div>{dayjs(e.start).format("DD MMM YYYY, dddd")}</div>
                  <div>
                    {dayjs(e.start).format("HH:mm")} –{" "}
                    {e.end ? dayjs(e.end).format("HH:mm") : "--"}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                if (selected.length === 0) {
                  alert("Please select at least one class");
                  return;
                }
                setShowConfirm(true);
              }}
              className="w-full px-4 py-2 rounded-lg bg-green-600 text-white text-xs"
            >
              Book Class
            </button>
          </div>
        </div>
      </div>

      {/* FILTERED DATA */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
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

        {filteredEvents.length === 0 && (
          <p className="text-xs text-gray-500">No classes found</p>
        )}

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

      <div>
        <BookClassConfirmModal
          open={showConfirm}
          loading={bookingLoading}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleBookClass}
          selectedClasses={selected
            .map((idx) => filteredEvents[idx])
            .filter(Boolean)}
        />
      </div>

      {loading && <div className="text-xs text-gray-400 px-2">Loading…</div>}
    </div>
  );
};

export default BookClass;
