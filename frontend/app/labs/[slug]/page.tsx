import Link from "next/link";
import { notFound } from "next/navigation";
import { collegeInfo, labs, resourceList } from "../../lib/data";
import { figtree, sora } from "../../lib/fonts";
import SiteFooter from "../../components/SiteFooter";

type Params = { slug: string };

export default function LabDetailPage({ params }: { params: Params }) {
  const lab = labs.find((item) => item.slug === params.slug);

  if (!lab) {
    notFound();
  }

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-3xl font-semibold`}>{lab.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Mentor: {lab.mentor}</p>
          </div>
          <Link
            href="/labs"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Labs
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Resources</div>
          <div className="mt-4 grid gap-3 text-sm">
            {resourceList.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>{item}</span>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  NIL
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-900">
            Add lab manuals, experiment sheets, and evaluation rubrics when available.
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
