import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { BASE_URL } from "../src/Utils/Constants";

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

/* Helpers */
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

  if (String(rowTime).includes("/")) {
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

/* Component */

const CalendarFull = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Fetch calendar data */
  const fetchMonthData = useCallback(async (year, monthName) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/month-template`, {
        params: { year, month: monthName },
        withCredentials: true,
      });

      const mt = res?.data?.data;
      if (!mt) return setEvents([]);

      const weeks = ["week1", "week2", "week3", "week4"];
      const list = [];

      weeks.forEach((wk) => {
        const week = mt[wk];
        if (!week?.template) return;

        const startIso = normalizeDate(week.startDate);
        const endIso = normalizeDate(week.endDate);
        if (!startIso || !endIso) return;

        const start = dayjs(startIso);
        const end = dayjs(endIso);
        const days = week.template.days || {};

        Object.entries(days).forEach(([rawDayKey, rows]) => {
          const dayName = normalizeDayName(rawDayKey);
          if (!Array.isArray(rows) || !dayName) return;

          rows.forEach((row) => {
            const className = row?.classId?.name || "Class";

            let cursor = start.clone();
            while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
              if (cursor.format("dddd") === dayName) {
                const dateOnly = cursor.format("YYYY-MM-DD");

                const sdt = parseDateTime(row.startedAt, dateOnly);
                const edt = parseDateTime(row.endedAt, dateOnly);

                list.push({
                  title: `${className} • ${sdt ? sdt.format("HH:mm") : ""}${
                    edt ? " - " + edt.format("HH:mm") : ""
                  }`,
                  start: sdt ? sdt.toISOString() : dateOnly,
                  end: edt ? edt.toISOString() : undefined,
                  allDay: !sdt,
                  extendedProps: { row, week: wk },
                });
              }

              cursor = cursor.add(1, "day");
            }
          });
        });
      });

      setEvents(list);
    } catch {
      setEvents([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const now = dayjs();
    fetchMonthData(now.format("YYYY"), now.format("MMMM"));
  }, []);

  const handleDatesSet = (info) => {
    const mid = dayjs(info.start).add(7, "day");
    fetchMonthData(mid.format("YYYY"), mid.format("MMMM"));
  };

  const handleEventClick = (info) => {
    alert(info.event.title);
  };

  /* CSS — FINAL VERSION (Light + Dark Perfect) */
  const calendarCSS = `
    :root {
      --fc-bg: #ffffff;
      --fc-text: #111;
      --fc-border: #d1d5db;
      --fc-header-bg: #f3f4f6;
      --fc-event-bg: #2563eb;
      --fc-event-text: #ffffff;
    }

    .dark {
      --fc-bg: #111218;
      --fc-text: #e5e7eb;
      --fc-border: #1f2937;
      --fc-header-bg: #14151c;
      --fc-event-bg: #1e40af;
      --fc-event-text: #ffffff;
    }

    /* GENERAL THEMING */
    .fc,
    .fc-scrollgrid,
    .fc-scrollgrid td,
    .fc-scrollgrid th {
      background: var(--fc-bg) !important;
      color: var(--fc-text) !important;
      border-color: var(--fc-border) !important;
    }

    /* HEADER CELLS */
    .fc-col-header-cell {
      background: var(--fc-header-bg) !important;
      color: var(--fc-text) !important;
      font-weight: 600 !important;
      opacity: 1 !important;
    }
    .fc-col-header-cell a {
      color: var(--fc-text) !important;
      opacity: 1 !important;
    }

    /* TODAY HIGHLIGHT (LIGHT MODE) */
    .fc-day-today {
      background: rgba(255, 80, 80, 0.18) !important;
      border: 1px solid rgba(255, 80, 80, 0.4) !important;
    }
    .fc-day-today .fc-daygrid-day-number {
      color: #b30000 !important;
      font-weight: 700 !important;
    }

    /* TODAY — WEEK VIEW */
    .fc-col-header-cell.fc-day-today {
      background: rgba(255, 80, 80, 0.25) !important;
    }
    .fc-col-header-cell.fc-day-today a {
      color: #b30000 !important;
      font-weight: 700 !important;
    }

    /* TODAY (DARK MODE) */
    .dark .fc-day-today,
    .dark .fc-col-header-cell.fc-day-today {
      background: rgba(120, 0, 0, 0.55) !important;
      border-color: rgba(255, 0, 0, 0.45) !important;
    }
    .dark .fc-day-today .fc-daygrid-day-number,
    .dark .fc-col-header-cell.fc-day-today a {
      color: #ffffff !important;
      font-weight: 700 !important;
    }

    /* EVENTS */
    .fc-event {
      background: var(--fc-event-bg) !important;
      border-color: var(--fc-event-bg) !important;
      color: var(--fc-event-text) !important;
      border-radius: 4px !important;
      padding: 2px 5px !important;
      font-size: 12px !important;
    }

    /* BUTTONS */
    .fc-button {
      background: var(--fc-header-bg) !important;
      border: 1px solid var(--fc-border) !important;
      color: var(--fc-text) !important;
      border-radius: 6px !important;
    }
    .fc-button:hover {
      background: var(--fc-border) !important;
    }
  `;

  return (
    <div className="w-full p-6 bg-white dark:bg-[#111218] text-gray-900 dark:text-gray-100">
      <style>{calendarCSS}</style>

      <h1 className="text-xl font-semibold mb-1">Class schedules</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        View and manage your gym class schedules here.
      </p>

      <div className="rounded border border-gray-300 dark:border-gray-700 overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev today next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
          }}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          nowIndicator={true}
          height="auto"
        />
      </div>

      {loading && (
        <div className="text-xs text-gray-400 mt-2">Loading schedule…</div>
      )}
    </div>
  );
};

export default CalendarFull;
