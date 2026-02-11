"use client";

import { useEffect, useMemo, useState } from "react";
import { timetableByDay, timetableDays, type DayName, type TimetableEntry } from "../../lib/data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

type SlotInfo = { day: DayName; time: string };

type Props = {
  code: string;
};

export default function ScheduleSlots({ code }: Props) {
  const [timetableData, setTimetableData] = useState<Record<DayName, TimetableEntry[]>>(timetableByDay);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/timetable`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.timetableByDay) {
          setTimetableData({ ...timetableByDay, ...data.timetableByDay });
        }
      } catch {
        setTimetableData(timetableByDay);
      }
    };
    loadFromApi();
  }, []);

  const scheduleSlots = useMemo(() => {
    const slots: SlotInfo[] = [];
    timetableDays.forEach((day) => {
      timetableData[day]?.forEach((entry) => {
        if (entry.title === code) {
          slots.push({ day, time: `${entry.start}-${entry.end}` });
        }
      });
    });
    return slots;
  }, [code, timetableData]);

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
      {scheduleSlots.length ? (
        scheduleSlots.map((slot) => (
          <span key={`${slot.day}-${slot.time}`} className="rounded-full border border-slate-200 px-3 py-1">
            {slot.day.slice(0, 3)} {slot.time}
          </span>
        ))
      ) : (
        <span className="rounded-full border border-slate-200 px-3 py-1">Not scheduled</span>
      )}
    </div>
  );
}
