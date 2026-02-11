import Link from "next/link";
import { authorities, collegeInfo } from "../lib/data";
import { figtree, sora } from "../lib/fonts";
import SiteFooter from "../components/SiteFooter";

export default function AuthoritiesPage() {
  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-3xl font-semibold`}>Authorities</h1>
            <p className="mt-2 text-sm text-slate-600">Key academic contacts for Semester 6.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <section className="grid gap-4">
          {authorities.map((person) => (
            <div key={person.role} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{person.role}</div>
              <div className={`${sora.className} mt-3 text-xl font-semibold text-slate-900`}>{person.name}</div>
              <div className="mt-2 text-sm text-slate-600">Contact: {person.contact}</div>
              {person.contact !== "NIL" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`tel:${person.contact}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${person.contact}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    WhatsApp
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
