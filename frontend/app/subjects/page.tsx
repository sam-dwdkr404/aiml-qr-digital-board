"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { collegeInfo, subjects } from "../lib/data";
import { figtree, sora } from "../lib/fonts";

export default function SubjectsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return subjects;
    return subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(value) ||
        subject.code.toLowerCase().includes(value) ||
        subject.faculty.toLowerCase().includes(value)
      );
    });
  }, [query]);

  const coreSubjects = filtered.filter((subject) => subject.type === "core" || subject.type === "project");
  const labSubjects = filtered.filter((subject) => subject.type === "lab");

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-slate-600">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-2xl font-semibold`}>Subjects Hub</h1>
            <p className="mt-2 text-sm text-slate-600">Find subject notes, assignments, and lab resources.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Search</label>
          <input
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            placeholder="Find subject, code, or faculty"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <section className="grid gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Core Subjects</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreSubjects.map((subject) => (
              <Link
                key={subject.code}
                href={`/subjects/${encodeURIComponent(subject.code)}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: subject.accent }}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <div className={`${sora.className} text-lg font-semibold text-slate-900`}>{subject.name}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {subject.code}
                    </div>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Faculty: {subject.faculty}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-full border border-slate-200 px-3 py-1">Notes</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">Assignments</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">Internals</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Labs</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labSubjects.map((subject) => (
              <Link
                key={subject.code}
                href={`/subjects/${encodeURIComponent(subject.code)}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: subject.accent }}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <div className={`${sora.className} text-lg font-semibold text-slate-900`}>{subject.name}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {subject.code}
                    </div>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Faculty: {subject.faculty}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-full border border-slate-200 px-3 py-1">Manual</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">Experiments</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
