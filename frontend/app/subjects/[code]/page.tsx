import Link from "next/link";
import { notFound } from "next/navigation";
import { collegeInfo, subjects } from "../../lib/data";
import { figtree, sora } from "../../lib/fonts";
import SiteFooter from "../../components/SiteFooter";
import SubjectTabs from "./SubjectTabs";
import ScheduleSlots from "./ScheduleSlots";

type Params = { code: string };

export default function SubjectDetailPage({ params }: { params: Params }) {
  const code = decodeURIComponent(params.code);
  const subject = subjects.find((item) => item.code === code);

  if (!subject) {
    notFound();
  }

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-3xl font-semibold`}>{subject.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Code: {subject.code} | Faculty: {subject.faculty}</p>
          </div>
          <Link
            href="/subjects"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Subjects
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Faculty</div>
              <div className={`${sora.className} mt-2 text-xl font-semibold text-slate-900`}>{subject.faculty}</div>
              <div className="mt-1 text-sm text-slate-600">Email: NIL</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Schedule</div>
              <ScheduleSlots code={subject.code} />
            </div>
          </div>
        </section>

        <SubjectTabs code={subject.code} />

        <SiteFooter />
      </main>
    </div>
  );
}
