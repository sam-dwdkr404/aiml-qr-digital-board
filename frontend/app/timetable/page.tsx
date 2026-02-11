"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collegeInfo, timetableByDay, timetableDays, type DayName, type TimetableEntry } from "../lib/data";
import { figtree, sora } from "../lib/fonts";
import { getCurrentSlotKey, getIndiaDay } from "../lib/time";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

const breaks = [
  { label: "Break", start: "11:30", end: "11:45" },
  { label: "Lunch", start: "1:30", end: "2:15" },
];

export default function TimetablePage() {
  const today = getIndiaDay();
  const [selected, setSelected] = useState<DayName | "Sunday">(today);
  const currentSlot = getCurrentSlotKey();
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

  const sessions = useMemo(() => {
    if (selected === "Sunday") return [];
    return timetableData[selected];
  }, [selected, timetableData]);

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-slate-600">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-2xl font-semibold`}>Full Timetable</h1>
            <p className="mt-2 text-sm text-slate-600">{collegeInfo.academicYear} | {collegeInfo.semester}</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {timetableDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(day)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selected === day
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected === "Sunday" ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
              No classes scheduled on Sunday.
            </div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => {
                const isCurrent = selected === today && currentSlot === session.start;

                return (
                  <div
                    key={`${session.start}-${session.title}`}
                    className={`rounded-2xl border px-4 py-4 ${
                      isCurrent ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{session.start}</div>
                        <div className={`${sora.className} mt-1 text-lg font-semibold text-slate-900`}>{session.title}</div>
                        <div className="text-sm text-slate-600">{session.start} - {session.end}</div>
                      </div>
                      {isCurrent ? (
                        <span className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                          Live
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {breaks.map((breakItem) => (
                <div
                  key={breakItem.label}
                  className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
                >
                  {breakItem.label} | {breakItem.start} - {breakItem.end}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
