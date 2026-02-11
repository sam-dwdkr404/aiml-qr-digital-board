"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { figtree, sora } from "../../../app/lib/fonts";
import { subjects, timetableByDay, timetableDays, type DayName, type TimetableEntry } from "../../../app/lib/data";
import { ChevronRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

export default function Admin() {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanStats, setScanStats] = useState({
    totalScans: 0,
    todayScans: 0,
    lastScanAt: "N/A",
  });
  const [resourceStats, setResourceStats] = useState({
    assignmentCount: 0,
    internalsCount: 0,
  });
  const [timetableDraft, setTimetableDraft] = useState<Record<DayName, TimetableEntry[]>>(timetableByDay);
  const [activeDay, setActiveDay] = useState<DayName>(timetableDays[0]);
  const [timetableStatus, setTimetableStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!adminEmail || !adminPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword, role: "admin" }),
      });
      if (!res.ok) {
        setErrorMsg("Invalid email or password");
        return;
      }
      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", adminEmail);
      setLoggedIn(true);
    } catch {
      setErrorMsg("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    const raw = localStorage.getItem("scanAnalytics");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const todayKey = new Date().toISOString().slice(0, 10);
      setScanStats({
        totalScans: parsed.totalScans ?? 0,
        todayScans: parsed.dailyCounts?.[todayKey] ?? 0,
        lastScanAt: parsed.lastScanAt ?? "N/A",
      });
    } catch {
      setScanStats({ totalScans: 0, todayScans: 0, lastScanAt: "N/A" });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    const loadResources = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/resources`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const values = Object.values(data.resourcesBySubject ?? {}) as Array<{
          assignments?: Array<{ label: string; url: string }>;
          internals?: Array<{ label: string; url: string }>;
        }>;
        const assignmentCount = values.reduce((sum, item) => sum + (item.assignments?.length ?? 0), 0);
        const internalsCount = values.reduce((sum, item) => sum + (item.internals?.length ?? 0), 0);
        setResourceStats({ assignmentCount, internalsCount });
      } catch {
        setResourceStats({ assignmentCount: 0, internalsCount: 0 });
      }
    };
    loadResources();
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const loadTimetable = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/timetable`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.timetableByDay) {
          setTimetableDraft({ ...timetableByDay, ...data.timetableByDay });
        }
      } catch {
        setTimetableDraft(timetableByDay);
      }
    };
    loadTimetable();
  }, [loggedIn]);

  const updateEntry = (index: number, field: keyof TimetableEntry, value: string) => {
    setTimetableDraft((prev) => {
      const next = [...prev[activeDay]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [activeDay]: next };
    });
  };

  const addEntry = () => {
    setTimetableDraft((prev) => ({
      ...prev,
      [activeDay]: [...prev[activeDay], { title: "", start: "9:30", end: "10:30", portion: "" }],
    }));
  };

  const removeEntry = (index: number) => {
    setTimetableDraft((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].filter((_, idx) => idx !== index),
    }));
  };

  const saveTimetable = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setTimetableStatus("error");
      return;
    }
    setTimetableStatus("saving");
    try {
      const res = await fetch(`${API_BASE}/api/timetable`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ timetableByDay: timetableDraft }),
      });
      if (!res.ok) throw new Error("Failed");
      setTimetableStatus("saved");
      setTimeout(() => setTimetableStatus("idle"), 1500);
    } catch {
      setTimetableStatus("error");
    }
  };

  const totalClasses = timetableDays.reduce((sum, day) => sum + (timetableDraft[day]?.length ?? 0), 0);

  return (
    <div className={`${figtree.className} min-h-screen bg-gray-50`}>
      {!loggedIn ? (
        <div className="min-h-screen flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                  AD
                </div>
                <div>
                  <div className={`${sora.className} text-2xl font-bold text-gray-900`}>Admin Panel</div>
                  <div className="text-xs text-gray-600">CSE (AIML) Digital Board</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="mb-6">
                <h2 className={`${sora.className} text-xl font-bold text-gray-900 mb-2`}>Admin Access</h2>
                <p className="text-sm text-gray-600">Only authorized personnel can access this panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Admin Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Email ID</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@agmrcet.edu.in"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="********"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  Enter Admin Panel
                  <ChevronRight size={18} />
                </button>
              </form>

          </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/" className="text-blue-600 hover:underline font-semibold">
                Back to Student Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <div>
                <div className={`${sora.className} text-2xl font-bold text-gray-900`}>Admin Dashboard</div>
                <div className="text-sm text-gray-600">Welcome, {adminName}</div>
              </div>
              <button
                onClick={() => {
                  setLoggedIn(false);
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminEmail");
                }}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {[
                { label: "Total Classes", value: String(totalClasses), icon: "CL" },
                { label: "Timetable Days", value: String(timetableDays.length), icon: "DY" },
                { label: "Subjects", value: String(subjects.length), icon: "SU" },
                { label: "Assignments", value: String(resourceStats.assignmentCount), icon: "AS" },
                { label: "Total Scans", value: String(scanStats.totalScans), icon: "SC" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="text-sm font-semibold text-slate-500 mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 mb-8">
              <div className="font-semibold">Scan Analytics</div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-blue-800">
                <span>Today: {scanStats.todayScans}</span>
                <span>Last Scan: {scanStats.lastScanAt}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className={`${sora.className} text-lg font-bold text-gray-900 mb-4`}>Manage Timetable</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {timetableDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                        activeDay === day ? "bg-slate-900 text-white border-slate-900" : "text-slate-700 border-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  {timetableDraft[activeDay]?.map((entry, idx) => (
                    <div key={idx} className="grid gap-2 rounded-lg border border-slate-200 p-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          value={entry.title}
                          onChange={(e) => updateEntry(idx, "title", e.target.value)}
                          placeholder="Subject code / title"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900"
                        />
                        <input
                          type="text"
                          value={entry.portion ?? ""}
                          onChange={(e) => updateEntry(idx, "portion", e.target.value)}
                          placeholder="Portion (e.g., Module 1)"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900"
                        />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                        <input
                          type="text"
                          value={entry.start}
                          onChange={(e) => updateEntry(idx, "start", e.target.value)}
                          placeholder="Start"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900"
                        />
                        <input
                          type="text"
                          value={entry.end}
                          onChange={(e) => updateEntry(idx, "end", e.target.value)}
                          placeholder="End"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900"
                        />
                        <button
                          onClick={() => removeEntry(idx)}
                          className="w-full sm:w-auto rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={addEntry}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Add Slot
                  </button>
                  <button
                    onClick={saveTimetable}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Save Timetable
                  </button>
                  {timetableStatus === "saving" && (
                    <span className="text-xs text-slate-500">Saving...</span>
                  )}
                  {timetableStatus === "saved" && (
                    <span className="text-xs text-emerald-600">Saved</span>
                  )}
                  {timetableStatus === "error" && (
                    <span className="text-xs text-red-600">Save failed</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className={`${sora.className} text-lg font-bold text-gray-900 mb-4`}>Manage Subjects</div>
                <Link href="/subjects" className="block w-full text-center bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold py-3 rounded-lg transition-colors">
                  Open Subjects View
                </Link>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className={`${sora.className} text-lg font-bold text-gray-900 mb-4`}>Manage Assignments</div>
                <Link href="/admin/resources" className="block w-full text-center bg-green-50 hover:bg-green-100 text-green-600 font-semibold py-3 rounded-lg transition-colors">
                  Add/Edit Assignments
                </Link>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className={`${sora.className} text-lg font-bold text-gray-900 mb-4`}>Manage CIE Papers</div>
                <Link href="/admin/resources" className="block w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold py-3 rounded-lg transition-colors">
                  Manage Internals/CIE
                </Link>
                <div className="mt-2 text-xs text-slate-500">Current internals links: {resourceStats.internalsCount}</div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
