"use client";

import { useEffect, useMemo, useState } from "react";
import {
  authorities,
  collegeInfo,
  subjects,
  timetableByDay,
  type DayName,
  type TimetableEntry,
  subjectResources,
  type SubjectResource,
} from "./lib/data";
import { figtree, sora } from "./lib/fonts";
import { getIndiaDateLabel, getIndiaDay } from "./lib/time";
import { Calendar, BookOpen, FlaskConical, FileText } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

type TabKey = "notes" | "assignments" | "internals" | "labManuals";

const tabs: { key: TabKey; label: string }[] = [
  { key: "notes", label: "Notes" },
  { key: "assignments", label: "Assignments" },
  { key: "internals", label: "Internals" },
  { key: "labManuals", label: "Lab Manuals" },
];

const toMinutes = (time: string) => {
  const [rawHour, rawMinute] = time.split(":");
  let hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (hour < 8) hour += 12;
  return hour * 60 + minute;
};

const to24Hour = (time: string) => {
  const [rawHour, rawMinute] = time.split(":");
  let hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (hour < 8) hour += 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const getIndiaMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
};

const getTodaySchedule = (data: Record<DayName, TimetableEntry[]>) => {
  const today = getIndiaDay() as DayName;
  const entries = data[today] || [];
  const currentTime = getIndiaMinutes();

  return entries.map((entry) => {
    const startMinutes = toMinutes(entry.start);
    const endMinutes = toMinutes(entry.end);

    let status: "past" | "current" | "next" = "next";
    if (currentTime >= endMinutes) status = "past";
    else if (currentTime >= startMinutes && currentTime < endMinutes) status = "current";

    const subjectData = subjects.find((s) => s.code === entry.title);

    return {
      ...entry,
      status,
      subject: subjectData,
    };
  });
};

const getLiveClass = (data: Record<DayName, TimetableEntry[]>) => {
  const schedule = getTodaySchedule(data);
  const found = schedule.find((s) => s.status === "current") || schedule.find((s) => s.status === "next");
  return found;
};

const migrateResources = (raw: Record<string, SubjectResource>) => {
  const normalized: Record<string, SubjectResource> = {};
  Object.entries(raw || {}).forEach(([code, value]) => {
    normalized[code] = {
      notes: value.notes ?? [],
      assignments: value.assignments ?? [],
      internals: value.internals ?? [],
      labManuals: value.labManuals ?? value.labManual ?? [],
      modules: value.modules ?? [],
      modelPapers: value.modelPapers ?? [],
      pyq: value.pyq ?? [],
      solutions: value.solutions ?? [],
      labManual: value.labManual ?? [],
    };
  });
  return normalized;
};

const renderLinks = (items?: { label: string; url: string }[], accent?: string) => {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        NIL / Not updated
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <a
          key={`${item.label}-${item.url}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 hover:text-slate-900 transition"
          style={{ borderColor: accent ?? "#e2e8f0" }}
        >
          <span className="truncate">{item.label}</span>
          <span
            className="text-xs font-semibold text-white rounded-full px-3 py-1"
            style={{ backgroundColor: accent ?? "#2563eb" }}
          >
            Open
          </span>
        </a>
      ))}
    </div>
  );
};

const ResourceSection = ({
  title,
  items,
  accent,
}: {
  title: string;
  items?: { label: string; url: string }[];
  accent?: string;
}) => (
  <div className="grid gap-2">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent ?? "#2563eb" }} />
      <span>{title}</span>
    </div>
    {renderLinks(items, accent)}
  </div>
);

export default function Home() {
  const [activeSubject, setActiveSubject] = useState(subjects[0]?.code ?? "");
  const [activeTab, setActiveTab] = useState<TabKey>("notes");
  const [resources, setResources] = useState<Record<string, SubjectResource>>({});
  const [cieModalOpen, setCieModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [syllabusLink, setSyllabusLink] = useState<string | null>(null);
  const [timetableData, setTimetableData] = useState<Record<DayName, TimetableEntry[]>>(timetableByDay);

  const todayLabel = getIndiaDateLabel();
  const todaySchedule = getTodaySchedule(timetableData);
  const liveClass = getLiveClass(timetableData);

  const coreSubjects = useMemo(
    () => subjects.filter((s) => s.type === "core" || s.type === "project" || s.type === "lab"),
    []
  );

  useEffect(() => {
    const hasAnyLinks = (data: Record<string, any>) =>
      Object.values(data).some((subject: any) =>
        ["modules", "modelPapers", "pyq", "assignments", "internals", "labManuals"].some(
          (key) => Array.isArray(subject?.[key]) && subject[key].length > 0
        )
      );

    const load = () => {
      const saved = localStorage.getItem("subjectResources");
      if (saved) {
        setResources(migrateResources(JSON.parse(saved)));
      } else {
        setResources(migrateResources(subjectResources));
      }
      setSyllabusLink(localStorage.getItem("globalSyllabusLink"));
    };

    const loadFromApi = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/resources`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const apiResources = data.resourcesBySubject ?? {};
        const apiHasData = hasAnyLinks(apiResources);
        const saved = localStorage.getItem("subjectResources");
        if (!apiHasData && saved) {
          setResources(migrateResources(JSON.parse(saved)));
          return;
        }
        const merged = { ...subjectResources, ...apiResources };
        setResources(migrateResources(merged));
        if (data.globalSyllabusLink) {
          setSyllabusLink(data.globalSyllabusLink);
        }
      } catch {
        load();
      }
    };

    loadFromApi();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "subjectResources") {
        load();
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", load);
    };
  }, []);

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

  useEffect(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const timestamp = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    const raw = localStorage.getItem("scanAnalytics");
    const current = raw ? JSON.parse(raw) : { totalScans: 0, dailyCounts: {}, lastScanAt: "" };
    const dailyCounts = { ...(current.dailyCounts ?? {}) };
    dailyCounts[todayKey] = (dailyCounts[todayKey] ?? 0) + 1;

    const next = {
      totalScans: (current.totalScans ?? 0) + 1,
      dailyCounts,
      lastScanAt: timestamp,
    };
    localStorage.setItem("scanAnalytics", JSON.stringify(next));
  }, []);

  const currentResources = resources[activeSubject] ?? migrateResources(subjectResources)[activeSubject] ?? {};
  const activeAccent = subjects.find((subject) => subject.code === activeSubject)?.accent ?? "#2563eb";

  const assignmentsFromAdmin = useMemo(() => {
    const list: Array<{ subjectCode: string; subjectName: string; label: string; url: string }> = [];
    Object.entries(resources).forEach(([code, value]) => {
      const subjectName = subjects.find((s) => s.code === code)?.name ?? code;
      (value.assignments ?? []).forEach((assignment) => {
        list.push({ subjectCode: code, subjectName, label: assignment.label, url: assignment.url });
      });
    });
    return list;
  }, [resources]);

  const internalsFromAdmin = useMemo(() => {
    const list: Array<{ subjectCode: string; subjectName: string; label: string; url: string }> = [];
    Object.entries(resources).forEach(([code, value]) => {
      const subjectName = subjects.find((s) => s.code === code)?.name ?? code;
      (value.internals ?? []).forEach((internal) => {
        list.push({ subjectCode: code, subjectName, label: internal.label, url: internal.url });
      });
    });
    return list;
  }, [resources]);

  const groupBySubject = <T extends { subjectCode: string; subjectName: string }>(items: T[]) => {
    const grouped = new Map<string, { subjectName: string; items: T[] }>();
    items.forEach((item) => {
      if (!grouped.has(item.subjectCode)) {
        grouped.set(item.subjectCode, { subjectName: item.subjectName, items: [] });
      }
      grouped.get(item.subjectCode)!.items.push(item);
    });
    return grouped;
  };

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">{collegeInfo.department}</p>
              <h1 className={`${sora.className} text-2xl font-semibold text-slate-900`}>Academic Dashboard</h1>
              <p className="text-xs text-blue-600 mt-1">{todayLabel}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Live Sync
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {liveClass ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                <span className={`h-2.5 w-2.5 rounded-full ${liveClass.status === "current" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
                {liveClass.status === "current" ? "LIVE CLASS" : "NEXT UP"}
              </div>
              <div className={`${sora.className} text-2xl font-semibold text-slate-900`}>
                {liveClass.subject?.name || liveClass.title}
              </div>
              <div className="text-sm text-slate-600">
                {liveClass.subject?.faculty || "Faculty not assigned"} • Room 604
              </div>
              <div className="text-xs font-semibold text-blue-700">
                {to24Hour(liveClass.start)} - {to24Hour(liveClass.end)}
              </div>
              {liveClass.portion ? (
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 w-fit">
                  Portion: {liveClass.portion}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-slate-600">No live class at the moment.</div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className={`${sora.className} text-lg font-semibold`}>Today&apos;s Timeline</h2>
            <Calendar size={18} className="text-blue-600" />
          </div>
          <div className="mt-4 grid gap-3">
            {todaySchedule.map((entry, idx) => {
              const status = entry.status as "past" | "current" | "next";
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border px-4 py-3 transition ${
                    status === "current"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-semibold text-slate-500 w-12">
                        {to24Hour(entry.start)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{entry.subject?.name || entry.title}</div>
                        {entry.subject && (
                          <div className="text-xs text-slate-500">{entry.subject.faculty}</div>
                        )}
                        {entry.portion ? (
                          <div className="text-xs text-blue-700 font-semibold mt-1">Portion: {entry.portion}</div>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{status.toUpperCase()}</span>
                  </div>
                  {status === "current" && (
                    <div className="mt-2 text-xs font-semibold text-blue-700">In progress now</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`${sora.className} text-lg font-semibold`}>Subject Resources</h2>
              <p className="text-xs text-slate-500 mt-1">Managed by Admin Dashboard</p>
            </div>
            <BookOpen size={18} className="text-blue-600" />
          </div>

          <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {activeSubject} • {subjects.find((subject) => subject.code === activeSubject)?.name ?? activeSubject}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {coreSubjects.map((subject) => (
              <button
                key={subject.code}
                onClick={() => setActiveSubject(subject.code)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition border ${
                  activeSubject === subject.code
                    ? "text-white"
                    : "text-slate-700 hover:border-slate-300"
                }`}
                style={
                  activeSubject === subject.code
                    ? { backgroundColor: subject.accent, borderColor: subject.accent }
                    : { borderColor: subject.accent }
                }
              >
                {subject.code} • {subject.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4">
            {activeTab === "notes" && (
              <div className="grid gap-4">
                <ResourceSection
                  title={activeSubject === "BCSL606" ? "Program Notes" : "Module Notes"}
                  items={currentResources.modules}
                  accent={activeAccent}
                />
                {activeSubject === "BCSL606" ? null : (
                  <>
                    <ResourceSection title="Model Papers" items={currentResources.modelPapers} accent={activeAccent} />
                    <ResourceSection
                      title="Previous Year Questions"
                      items={currentResources.pyq}
                      accent={activeAccent}
                    />
                  </>
                )}
              </div>
            )}
            {activeTab === "assignments" && renderLinks(currentResources.assignments, activeAccent)}
            {activeTab === "internals" && renderLinks(currentResources.internals, activeAccent)}
            {activeTab === "labManuals" &&
              renderLinks(currentResources.labManuals ?? currentResources.labManual, activeAccent)}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`${sora.className} text-lg font-semibold text-amber-900`}>Syllabus Copy</h2>
              <p className="text-xs text-amber-700 mt-1">Semester 6 AIML • All subjects in one PDF</p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href={syllabusLink ?? "/pdfs/Sem6_AIML_Syllabus.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-200/80 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200"
            >
              Download Syllabus PDF
            </a>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => setCieModalOpen(true)}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left hover:border-blue-300 transition shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">CIE Papers</span>
              <FileText size={18} className="text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Question papers and solutions</p>
          </button>
          <button
            onClick={() => setAssignmentModalOpen(true)}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left hover:border-blue-300 transition shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Assignments</span>
              <FlaskConical size={18} className="text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Pending submissions</p>
          </button>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 text-sm text-slate-600 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Academic Infrastructure</div>
              <div className="mt-2 font-semibold text-slate-800">{collegeInfo.collegeName}</div>
              <div className="mt-1 text-slate-600 leading-relaxed">{collegeInfo.department}</div>
              <div className="mt-1 text-slate-600">Trust: {collegeInfo.trust}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Affiliation</div>
              <ul className="mt-2 space-y-1">
                {collegeInfo.affiliation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Authorities</div>
              <ul className="mt-2 space-y-2">
                {authorities.map((authority) => (
                  <li key={authority.role}>
                    <div className="font-semibold text-slate-800">{authority.role}</div>
                    <div>{authority.name}</div>
                    <div>{authority.contact}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center font-semibold text-slate-700">
            Designed and Developed by Samanvita Dharwadkar
          </div>
        </section>
      </main>

      {cieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 py-6 sm:py-0">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className={`${sora.className} text-lg font-semibold text-slate-900`}>Internals (CIE)</h2>
              <button onClick={() => setCieModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                Close
              </button>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {internalsFromAdmin.length === 0 ? (
                <div className="px-6 py-6 text-sm text-slate-600">No internals added yet.</div>
              ) : (
                Array.from(groupBySubject(internalsFromAdmin).entries()).map(([code, group]) => (
                  <div key={code} className="px-6 py-4">
                    <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {code} • {group.subjectName}
                    </div>
                    <div className="grid gap-2">
                      {group.items.map((internal) => (
                        <a
                          key={`${internal.subjectCode}-${internal.label}`}
                          href={internal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          {internal.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {assignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 py-6 sm:py-0">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className={`${sora.className} text-lg font-semibold text-slate-900`}>Assignments</h2>
              <button onClick={() => setAssignmentModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                Close
              </button>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {assignmentsFromAdmin.length === 0 ? (
                <div className="px-6 py-6 text-sm text-slate-600">No assignments added yet.</div>
              ) : (
                Array.from(groupBySubject(assignmentsFromAdmin).entries()).map(([code, group]) => (
                  <div key={code} className="px-6 py-4">
                    <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {code} • {group.subjectName}
                    </div>
                    <div className="grid gap-2">
                      {group.items.map((assignment) => (
                        <a
                          key={`${assignment.subjectCode}-${assignment.label}`}
                          href={assignment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          {assignment.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
