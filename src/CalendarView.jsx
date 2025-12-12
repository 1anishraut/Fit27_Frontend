import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { BASE_URL } from "../src/Utils/Constants";

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const normalizeDate = (d) => {
  if (!d) return null;
  const p1 = dayjs(d, "DD/MM/YYYY", true);
  if (p1.isValid()) return p1.format("YYYY-MM-DD");
  const p2 = dayjs(d, "YYYY-MM-DD", true);
  if (p2.isValid()) return p2.format("YYYY-MM-DD");
  const p3 = dayjs(d);
  return p3.isValid() ? p3.format("YYYY-MM-DD") : null;
};

const normalizeDayName = (raw) => {
  if (!raw) return "";
  const r = raw.trim().toLowerCase();
  if (r.startsWith("mon")) return "Monday";
  if (r.startsWith("tue")) return "Tuesday";
  if (r.startsWith("wed")) return "Wednesday";
  if (r.startsWith("thu")) return "Thursday";
  if (r.startsWith("fri")) return "Friday";
  if (r.startsWith("sat")) return "Saturday";
  if (r.startsWith("sun")) return "Sunday";
  return "";
};

const parseDateTime = (rowTime, calendarDate) => {
  if (!rowTime) return null;
  const formatsWithDate = [
    "DD/MM/YYYY HH:mm",
    "DD/MM/YYYY HH:mm A",
    "DD/MM/YYYYTHH:mm",
  ];
  const formatsWithoutDate = [
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD HH:mm A",
    "YYYY-MM-DDTHH:mm",
  ];
  const timeOnlyFormats = ["HH:mm", "HH:mm A", "H:mm", "h:mm A"];

  let dt;
  if (rowTime.includes("/")) {
    dt = dayjs(rowTime, formatsWithDate, true);
    if (dt.isValid()) return dt;
    dt = dayjs(rowTime, formatsWithDate);
    if (dt.isValid()) return dt;
  }

  const combined = `${calendarDate} ${rowTime}`;
  dt = dayjs(combined, formatsWithoutDate, true);
  if (dt.isValid()) return dt;
  dt = dayjs(combined);
  if (dt.isValid()) return dt;

  dt = dayjs(rowTime, timeOnlyFormats, true);
  if (dt.isValid()) return dt;

  dt = dayjs(rowTime);
  return dt.isValid() ? dt : null;
};

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState("month");

  const month = currentDate.format("MMMM");
  const year = currentDate.format("YYYY");

  const fetchMonthData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/month-template`, {
        params: { year, month },
        withCredentials: true,
      });

      const mt = res?.data?.data;
      if (!mt) return setEvents([]);

      const weeks = ["week1", "week2", "week3", "week4"];
      const allEvents = [];

      weeks.forEach((wk) => {
        const week = mt[wk];
        if (!week || !week.template) return;

        const startIso = normalizeDate(week.startDate);
        const endIso = normalizeDate(week.endDate);
        if (!startIso || !endIso) return;

        const start = dayjs(startIso);
        const end = dayjs(endIso);

        const daysObj = week.template.days || {};

        Object.entries(daysObj).forEach(([rawDayKey, rows]) => {
          const dayName = normalizeDayName(rawDayKey);
          if (!dayName) return;

          rows.forEach((row) => {
            const className = row?.classId?.name || "Class";

            let cursor = start.clone();
            while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
              if (cursor.format("dddd") === dayName) {
                const dateStr = cursor.format("YYYY-MM-DD");

                const sdt = parseDateTime(row.startedAt, dateStr);
                const edt = parseDateTime(row.endedAt, dateStr);

                allEvents.push({
                  date: dateStr,
                  startTime: sdt?.format("HH:mm") || "--:--",
                  endTime: edt?.format("HH:mm") || "--:--",
                  className,
                });
              }
              cursor = cursor.add(1, "day");
            }
          });
        });
      });

      setEvents(allEvents);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  const firstDay = currentDate.startOf("month").isoWeekday();
  const daysInMonth = currentDate.daysInMonth();
  const emptyCells = Array(firstDay - 1).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getEventsForDate = (dateStr) =>
    events.filter((e) => e.date === dateStr);

  const weekStart = currentDate.startOf("week").add(1, "day");
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, "day")
  );

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <div className="w-full p-6 bg-white dark:bg-[#111218] text-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold mb-1">Class schedules</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        View and manage your gym class schedules here.
      </p>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        {/* Month Nav */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            className="px-3 py-2 bg-gray-200 dark:bg-[#14151c] border border-gray-700 rounded"
          >
            &lt;
          </button>

          <button
            onClick={() => setCurrentDate(dayjs())}
            className="px-3 py-2 bg-gray-200 dark:bg-[#14151c] border border-gray-700 rounded"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
            className="px-3 py-2 bg-gray-200 dark:bg-[#14151c] border border-gray-700 rounded"
          >
            &gt;
          </button>
        </div>

        <h2 className="text-2xl font-medium">
          {currentDate.format("MMMM YYYY")}
        </h2>

        {/* View Switch */}
        <div className="flex gap-2">
          {["month", "week", "day", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-4 py-2 rounded ${
                viewMode === v
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-200 dark:bg-[#14151c] border border-gray-700"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- MONTH VIEW ---------------- */}
      {viewMode === "month" && (
        <div className="grid grid-cols-7 border border-gray-700 rounded overflow-hidden">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="p-2 border-b border-gray-700 bg-gray-100 dark:bg-[#14151c] text-center font-semibold"
            >
              {d}
            </div>
          ))}

          {emptyCells.map((_, i) => (
            <div
              key={i}
              className="h-24 border border-gray-700 bg-gray-50 dark:bg-[#181920]"
            />
          ))}

          {monthDays.map((day) => {
            const dateStr = `${year}-${currentDate.format("MM")}-${String(
              day
            ).padStart(2, "0")}`;

            const isToday = dayjs().isSame(dateStr, "day");
            const dayEvents = getEventsForDate(dateStr);

            return (
              <div
                key={day}
                className={`h-32 border border-gray-700 p-2 bg-white dark:bg-[#14151c] ${
                  isToday ? "bg-yellow-100 dark:bg-yellow-800/30" : ""
                }`}
              >
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  {day}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.map((ev, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs p-1 rounded"
                    >
                      {ev.className} • {ev.startTime}-{ev.endTime}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- WEEK VIEW ---------------- */}
      {viewMode === "week" && (
        <div className="border border-gray-700 rounded overflow-auto">
          {/* Week Header */}
          <div className="grid grid-cols-8 bg-gray-100 dark:bg-[#14151c] border-b border-gray-700">
            <div className="p-2 font-semibold">Time</div>

            {weekDates.map((d) => {
              const isToday = d.isSame(dayjs(), "day");
              return (
                <div
                  key={d}
                  className={`p-2 text-center font-semibold ${
                    isToday ? "bg-yellow-200 dark:bg-yellow-600/30" : ""
                  }`}
                >
                  {d.format("ddd DD")}
                </div>
              );
            })}
          </div>

          {hours.map((hr) => {
            const isCurrentHour = Number(hr.split(":")[0]) === dayjs().hour();

            return (
              <div
                key={hr}
                className={`grid grid-cols-8 border-b border-gray-700 ${
                  isCurrentHour ? "bg-yellow-100 dark:bg-yellow-900/30" : ""
                }`}
              >
                <div className="p-2 text-xs text-gray-400">{hr}</div>

                {weekDates.map((d) => {
                  const dateStr = d.format("YYYY-MM-DD");
                  const dayEvents = getEventsForDate(dateStr);

                  const eventsThisHour = dayEvents.filter(
                    (ev) =>
                      Number(ev.startTime.split(":")[0]) ===
                      Number(hr.split(":")[0])
                  );

                  const isToday = d.isSame(dayjs(), "day");

                  return (
                    <div
                      key={d + hr}
                      className={`border-l border-gray-700 p-1 h-14 relative ${
                        isToday ? "bg-yellow-50 dark:bg-yellow-700/20" : ""
                      }`}
                    >
                      {eventsThisHour.map((ev, i) => (
                        <div
                          key={i}
                          className="absolute inset-x-1 top-1 bg-blue-900/40 text-blue-300 text-xs p-1 rounded"
                        >
                          {ev.className} — {ev.startTime} - {ev.endTime}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- DAY VIEW ---------------- */}
      {viewMode === "day" && (
        <div className="border border-gray-700 rounded overflow-hidden">
          <div className="p-3 bg-gray-100 dark:bg-[#14151c] font-semibold">
            {currentDate.format("dddd, MMM DD")}
          </div>

          {hours.map((hr) => {
            const isCurrentHour = Number(hr.split(":")[0]) === dayjs().hour();

            const dateStr = currentDate.format("YYYY-MM-DD");
            const dayEvents = getEventsForDate(dateStr);

            const eventsAtHour = dayEvents.filter(
              (ev) =>
                Number(ev.startTime.split(":")[0]) === Number(hr.split(":")[0])
            );

            return (
              <div
                key={hr}
                className={`grid grid-cols-6 border-b border-gray-700 h-14 ${
                  isCurrentHour ? "bg-yellow-100 dark:bg-yellow-900/30" : ""
                }`}
              >
                <div className="p-2 text-xs text-gray-400">{hr}</div>

                <div className="col-span-5 p-1 relative">
                  {eventsAtHour.map((ev, i) => (
                    <div
                      key={i}
                      className="absolute inset-x-1 top-1 bg-blue-900/40 text-blue-300 text-xs p-1 rounded"
                    >
                      {ev.className} • {ev.startTime}-{ev.endTime}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- LIST VIEW ---------------- */}
      {viewMode === "list" && (
        <div className="border border-gray-700 rounded p-4">
          {events.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No events to display
            </div>
          )}

          {events.map((ev, i) => (
            <div
              key={i}
              className="border-b border-gray-700 py-3 flex justify-between"
            >
              <div>
                <div className="font-semibold">{ev.className}</div>
                <div className="text-sm text-gray-400">{ev.date}</div>
              </div>

              <div className="text-sm text-gray-300">
                {ev.startTime} - {ev.endTime}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
