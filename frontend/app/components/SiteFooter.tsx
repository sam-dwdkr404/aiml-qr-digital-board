import { authorities, collegeInfo } from "../lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-12 rounded-3xl border border-slate-200 bg-white/90 px-6 py-6 text-sm text-slate-600 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Academic Infrastructure</div>
          <div className="mt-2 font-semibold text-slate-800">{collegeInfo.collegeName}</div>
          <div className="mt-1 text-slate-600">{collegeInfo.department}</div>
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
    </footer>
  );
}
