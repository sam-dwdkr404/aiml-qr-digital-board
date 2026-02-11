import Link from "next/link";
import { collegeInfo, labs } from "../lib/data";
import { figtree, sora } from "../lib/fonts";

export default function LabsPage() {
  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-slate-600">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-2xl font-semibold`}>Labs and Projects</h1>
            <p className="mt-2 text-sm text-slate-600">Practical resources, manuals, and project phase details.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {labs.map((lab) => (
            <Link
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`${sora.className} text-lg font-semibold text-slate-900`}>{lab.name}</div>
              <div className="mt-2 text-sm text-slate-600">Mentor: {lab.mentor}</div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full border border-slate-200 px-3 py-1">Experiments</span>
                <span className="rounded-full border border-slate-200 px-3 py-1">Manual</span>
                <span className="rounded-full border border-slate-200 px-3 py-1">Submission</span>
              </div>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
}
