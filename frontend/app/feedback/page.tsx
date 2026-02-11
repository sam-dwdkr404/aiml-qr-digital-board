"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { collegeInfo } from "../lib/data";
import { figtree, sora } from "../lib/fonts";
import SiteFooter from "../components/SiteFooter";

const categories = ["Bug", "Feature", "Content"];

export default function FeedbackPage() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const remaining = useMemo(() => Math.max(0, 500 - message.length), [message]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className={`${figtree.className} min-h-screen bg-slate-50 text-slate-900`}>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{collegeInfo.department}</p>
            <h1 className={`${sora.className} mt-3 text-3xl font-semibold`}>Feedback</h1>
            <p className="mt-2 text-sm text-slate-600">Your feedback is anonymous by default.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Live Status
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Optional Name</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="Your name (optional)"
              name="name"
            />
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Message</label>
            <textarea
              className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="Share a suggestion or issue"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 500))}
              required
            />
            <div className="text-xs text-slate-500">{remaining}/500 characters remaining</div>

            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Category (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item === category ? null : item)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    category === item
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Submit Feedback
            </button>
            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Thank you. Your message has been recorded for the admin.
              </div>
            ) : null}
          </form>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
