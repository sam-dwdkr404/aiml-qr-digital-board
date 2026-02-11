"use client";

import { useState, useEffect } from "react";
import { subjectResources, type ResourceLink, type SubjectResource } from "../../lib/data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

const tabs = [
  { key: "notes", label: "Notes" },
  { key: "syllabus", label: "Syllabus" },
  { key: "assignments", label: "Assignments" },
  { key: "internals", label: "Internals" },
  { key: "labManuals", label: "Lab Manuals" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

type Props = {
  code: string;
};

const renderLinks = (items?: ResourceLink[]) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
        <span>NIL / Not updated</span>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-blue-50"
        >
          <span>{item.label}</span>
          <span className="text-xs font-semibold text-slate-500">→</span>
        </a>
      ))}
    </div>
  );
};

const migrateResources = (raw: Record<string, SubjectResource>) => {
  const normalized: Record<string, SubjectResource> = {};

  Object.entries(raw).forEach(([code, value]) => {
    const notesFromLegacy = value.notes && value.notes.length > 0
      ? value.notes
      : [
          ...(value.modules ?? []),
          ...(value.modelPapers ?? []).map((item) => ({ ...item, label: `Model Paper: ${item.label}` })),
          ...(value.pyq ?? []).map((item) => ({ ...item, label: `PYQ: ${item.label}` })),
        ];

    normalized[code] = {
      notes: notesFromLegacy,
      assignments: value.assignments ?? [],
      internals: value.internals ?? [],
      labManuals: value.labManuals ?? value.labManual ?? [],
      syllabus: value.syllabus ?? [],
      modules: value.modules ?? [],
      modelPapers: value.modelPapers ?? [],
      pyq: value.pyq ?? [],
      solutions: value.solutions ?? [],
      labManual: value.labManual ?? [],
    };
  });

  return normalized;
};

export default function SubjectTabs({ code }: Props) {
  const [active, setActive] = useState<TabKey>("notes");
  const [resources, setResources] = useState<Record<string, SubjectResource>>({});

  // Load from localStorage on mount
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
        return;
      }
      setResources(migrateResources(subjectResources));
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
      } catch {
        load();
      }
    };

    loadFromApi();
  }, []);

  const currentResources = resources[code] ?? migrateResources(subjectResources)[code] ?? {};

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === tab.key
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {active === "notes" && (
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Notes</div>
            {renderLinks(currentResources.notes)}
            {currentResources.notes && currentResources.notes.length > 0 ? null : (
              <>
                <div className="text-xs uppercase tracking-wide text-slate-500">Module Notes</div>
                {renderLinks(currentResources.modules)}
                <div className="text-xs uppercase tracking-wide text-slate-500">Model Papers</div>
                {renderLinks(currentResources.modelPapers)}
                <div className="text-xs uppercase tracking-wide text-slate-500">Previous Year Questions</div>
                {renderLinks(currentResources.pyq)}
              </>
            )}
          </div>
        )}

        {active === "syllabus" && (
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Syllabus Copy</div>
            {renderLinks(currentResources.syllabus)}
          </div>
        )}

        {active === "assignments" && (
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Assignments</div>
            {renderLinks(currentResources.assignments)}
          </div>
        )}

        {active === "internals" && (
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Internals</div>
            {renderLinks(currentResources.internals)}
            <div className="text-xs text-slate-500">CIE-1 and CIE-2 schedules will appear here.</div>
          </div>
        )}

        {active === "labManuals" && (
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Lab Manuals</div>
            {renderLinks(currentResources.labManuals ?? currentResources.labManual)}
          </div>
        )}
      </div>
    </div>
  );
}
