'use client';

import Link from 'next/link';
import { LayoutDashboard, BookOpen, Calendar, FlaskConical, FileText, Plus } from 'lucide-react';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative pb-24">
      <main>{children}</main>

      {/* Floating Action Button */}
      <a
        href="/admin/resources"
        className="fixed right-4 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700"
        aria-label="Admin"
      >
        <Plus size={20} />
      </a>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-2 sm:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="flex flex-col items-center text-slate-700 text-xs">
            <LayoutDashboard size={20} />
            <span>Home</span>
          </Link>

          <Link href="/subjects" className="flex flex-col items-center text-slate-700 text-xs">
            <BookOpen size={20} />
            <span>Subjects</span>
          </Link>

          <Link href="/timetable" className="flex flex-col items-center text-slate-700 text-xs">
            <Calendar size={20} />
            <span>Timetable</span>
          </Link>

          <Link href="/labs" className="flex flex-col items-center text-slate-700 text-xs">
            <FlaskConical size={20} />
            <span>Labs</span>
          </Link>

          <Link href="/internals" className="flex flex-col items-center text-slate-700 text-xs">
            <FileText size={20} />
            <span>Internals</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
