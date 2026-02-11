import Link from "next/link";
import { collegeInfo } from "../lib/data";
import { figtree, sora } from "../lib/fonts";

const items = [
  { label: "Schedule", status: "Not announced" },
  { label: "Syllabus", status: "Pending" },
  { label: "Seating Arrangement", status: "NIL" },
];

const badgeTone = (status: string) => {
  if (status === "NIL") return "bg-slate-200 text-slate-700";
  if (status === "Pending") return "bg-amber-100 text-amber-800";
  if (status === "Not announced") return "bg-slate-100 text-slate-600";
  return "bg-emerald-100 text-emerald-700";
};

export default function InternalsPage() {
  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-slate-600">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-2xl font-semibold`}>Internal Assessments</h1>
            <p className="mt-2 text-sm text-slate-600">CIE schedules, syllabi, and seating updates.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {["CIE-1", "CIE-2"].map((cie) => (
            <div key={cie} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{cie}</div>
              <div className={`${sora.className} mt-3 text-2xl font-semibold text-slate-900`}>Not updated</div>
              <div className="mt-4 grid gap-3 text-sm">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span>{item.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeTone(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Previous Semester Papers</div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            NIL
          </div>
        </section>

      </main>
    </div>
  );
}
