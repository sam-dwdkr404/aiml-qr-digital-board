'use client';

import { useState, useEffect } from 'react';
import { LogOut, Save, Link2 } from 'lucide-react';
import { subjects } from '@/app/lib/data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

interface ResourceEditorState {
  [key: string]: {
    modules: Array<{ label: string; url: string }>;
    modelPapers: Array<{ label: string; url: string }>;
    pyq: Array<{ label: string; url: string }>;
    assignments: Array<{ label: string; url: string }>;
    internals: Array<{ label: string; url: string }>;
    labManuals: Array<{ label: string; url: string }>;
  };
}

const migrateResources = (raw: Record<string, any>, base: ResourceEditorState) => {
  const normalized: ResourceEditorState = { ...base };
  Object.entries(raw || {}).forEach(([code, value]) => {
    if (!normalized[code]) return;

    const modules = value.modules ?? [];
    const modelPapers = value.modelPapers ?? [];
    const pyq = value.pyq ?? [];

    if (modules.length === 0 && modelPapers.length === 0 && pyq.length === 0 && value.notes?.length) {
      const derivedModules: Array<{ label: string; url: string }> = [];
      const derivedModelPapers: Array<{ label: string; url: string }> = [];
      const derivedPyq: Array<{ label: string; url: string }> = [];

      value.notes.forEach((item: { label: string; url: string }) => {
        if (item.label.startsWith('Model Paper:')) {
          derivedModelPapers.push({ ...item, label: item.label.replace('Model Paper: ', '') });
        } else if (item.label.startsWith('PYQ:')) {
          derivedPyq.push({ ...item, label: item.label.replace('PYQ: ', '') });
        } else {
          derivedModules.push(item);
        }
      });

      normalized[code] = {
        modules: derivedModules,
        modelPapers: derivedModelPapers,
        pyq: derivedPyq,
        assignments: value.assignments ?? [],
        internals: value.internals ?? [],
        labManuals: value.labManuals ?? value.labManual ?? [],
      };
      return;
    }

    normalized[code] = {
      modules,
      modelPapers,
      pyq,
      assignments: value.assignments ?? [],
      internals: value.internals ?? [],
      labManuals: value.labManuals ?? value.labManual ?? [],
    };
  });
  return normalized;
};

const labelPrefix: Record<string, string> = {
  modules: 'Module',
  modelPapers: 'Model Paper',
  pyq: 'PYQ',
  assignments: 'Assignment',
  internals: 'Internal',
  labManuals: 'Lab Manual',
};

export default function ResourcesAdminPage() {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resources, setResources] = useState<ResourceEditorState>({});
  const [selectedSubject, setSelectedSubject] = useState('');
  const [syllabusLink, setSyllabusLink] = useState('');
  const [inputValues, setInputValues] = useState({
    modulesUrl: '',
    modulesLabel: '',
    modelPapersUrl: '',
    modelPapersLabel: '',
    pyqUrl: '',
    pyqLabel: '',
    assignmentsUrl: '',
    assignmentsLabel: '',
    internalsUrl: '',
    internalsLabel: '',
    labManualsUrl: '',
    labManualsLabel: '',
  });
  const [isClient, setIsClient] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    const initialized: ResourceEditorState = {};
    subjects.forEach((subject) => {
      initialized[subject.code] = {
        modules: [],
        modelPapers: [],
        pyq: [],
        assignments: [],
        internals: [],
        labManuals: [],
      };
    });

    const savedToken = localStorage.getItem('adminToken');
    const savedEmail = localStorage.getItem('adminEmail') ?? '';

    const hasAnyLinks = (data: Record<string, any>) =>
      Object.values(data).some((subject: any) =>
        ["modules", "modelPapers", "pyq", "assignments", "internals", "labManuals"].some(
          (key) => Array.isArray(subject?.[key]) && subject[key].length > 0
        )
      );

    const loadFromApi = async () => {
      if (!savedToken) {
        setResources(initialized);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/resources`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const apiResources = data.resourcesBySubject ?? {};
        const apiHasData = hasAnyLinks(apiResources);
        const localRaw = localStorage.getItem('subjectResources');
        const localParsed = localRaw ? JSON.parse(localRaw) : null;
        const localHasData = localParsed ? hasAnyLinks(localParsed) : false;

        if (!apiHasData && localHasData) {
          const restored = migrateResources(localParsed, initialized);
          setResources(restored);
          return;
        }

        const merged = migrateResources({ ...initialized, ...apiResources }, initialized);
        setResources(merged);
        setSyllabusLink(data.globalSyllabusLink ?? "");
        if (apiHasData) {
          localStorage.setItem('subjectResources', JSON.stringify(merged));
          localStorage.setItem('subjectResources_backup', JSON.stringify(merged));
        }
        if (data.globalSyllabusLink) {
          localStorage.setItem('globalSyllabusLink', data.globalSyllabusLink);
        }
      } catch {
        const localRaw = localStorage.getItem('subjectResources') || localStorage.getItem('subjectResources_backup');
        if (localRaw) {
          setResources(migrateResources(JSON.parse(localRaw), initialized));
        } else {
          setResources(initialized);
        }
      }
    };

    if (savedToken) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      setSelectedSubject(subjects[0]?.code ?? '');
      loadFromApi();
    } else {
      setResources(initialized);
    }

    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isClient) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const t = setTimeout(async () => {
      try {
        localStorage.setItem('subjectResources_backup', JSON.stringify(resources));
        await fetch(`${API_BASE}/api/resources`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            resourcesBySubject: resources,
            globalSyllabusLink: syllabusLink,
          }),
        });
        localStorage.setItem('subjectResources', JSON.stringify(resources));
        if (syllabusLink.trim()) {
          localStorage.setItem('globalSyllabusLink', syllabusLink.trim());
        }
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 1500);
      } catch {
        setAutoSaved(false);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [resources, syllabusLink, isLoggedIn, isClient]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
  };

  const handleAddResource = (
    type: 'modules' | 'modelPapers' | 'pyq' | 'assignments' | 'internals' | 'labManuals'
  ) => {
    if (!selectedSubject) return;

    const urlKey =
      type === 'modules'
        ? 'modulesUrl'
        : type === 'modelPapers'
          ? 'modelPapersUrl'
          : type === 'pyq'
            ? 'pyqUrl'
            : type === 'assignments'
              ? 'assignmentsUrl'
              : type === 'internals'
                ? 'internalsUrl'
                : 'labManualsUrl';
    const rawUrl = inputValues[urlKey].trim();
    const labelKey =
      type === 'modules'
        ? 'modulesLabel'
        : type === 'modelPapers'
          ? 'modelPapersLabel'
          : type === 'pyq'
            ? 'pyqLabel'
            : type === 'assignments'
              ? 'assignmentsLabel'
              : type === 'internals'
                ? 'internalsLabel'
                : 'labManualsLabel';
    const customLabel = inputValues[labelKey].trim();
    const pickUrl = (value: string) => {
      const match = value.match(/https?:\/\/\S+/i) || value.match(/https?:\/\S+/i);
      if (!match) return "";
      return match[0].replace(/^https?:\/(?!\/)/i, (prefix) => `${prefix}/`);
    };

    let url = rawUrl;
    if (!url) {
      url = pickUrl(customLabel);
    }
    if (url) {
      url = pickUrl(url) || url;
    }

    if (!url) {
      alert('Please enter a valid URL');
      return;
    }

    const resolvedLabel = customLabel
      ? customLabel.replace(url, "").replace(/\s*[:\-]\s*$/, "").trim()
      : "";

    setResources((prev) => ({
      ...prev,
      [selectedSubject]: {
        ...prev[selectedSubject],
        [type]: [
          ...prev[selectedSubject][type],
          {
            label:
              resolvedLabel ||
              customLabel ||
              `${labelPrefix[type]} ${prev[selectedSubject][type].length + 1}`,
            url,
          },
        ],
      },
    }));

    setInputValues((prev) => ({ ...prev, [urlKey]: '', [labelKey]: '' }));
  };

  const handleRemoveResource = (
    type: 'modules' | 'modelPapers' | 'pyq' | 'assignments' | 'internals' | 'labManuals',
    index: number
  ) => {
    if (!selectedSubject) return;

    setResources((prev) => ({
      ...prev,
      [selectedSubject]: {
        ...prev[selectedSubject],
        [type]: prev[selectedSubject][type].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSaveResources = () => {
    alert('Saved. All users will see updates after refresh.');
  };

  const handleListItemChange = (
    type: 'modelPapers' | 'pyq' | 'assignments' | 'internals',
    index: number,
    field: 'label' | 'url',
    value: string
  ) => {
    if (!selectedSubject) return;
    setResources((prev) => {
      const items = prev[selectedSubject][type];
      const next = items.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
      return {
        ...prev,
        [selectedSubject]: { ...prev[selectedSubject], [type]: next },
      };
    });
  };

  const handleAddListItem = (type: 'modelPapers' | 'pyq' | 'assignments' | 'internals') => {
    if (!selectedSubject) return;
    setResources((prev) => {
      const items = prev[selectedSubject][type];
      const nextLabel = `${labelPrefix[type]} ${items.length + 1}`;
      return {
        ...prev,
        [selectedSubject]: {
          ...prev[selectedSubject],
          [type]: [...items, { label: nextLabel, url: '' }],
        },
      };
    });
  };

  const handleRemoveListItem = (type: 'modelPapers' | 'pyq' | 'assignments' | 'internals', index: number) => {
    if (!selectedSubject) return;
    setResources((prev) => {
      const items = prev[selectedSubject][type].filter((_, idx) => idx !== index);
      return {
        ...prev,
        [selectedSubject]: { ...prev[selectedSubject], [type]: items },
      };
    });
  };

  const handleModuleChange = (index: number, url: string, labelPrefixValue: string) => {
    const targetSubject = selectedSubject || subjects[0]?.code;
    if (!targetSubject) return;
    setResources((prev) => {
      const existing = prev[targetSubject]?.modules ?? [];
      const next = [...existing];
      const label = `${labelPrefixValue} ${index + 1}`;
      const trimmed = url.trim();

      if (!trimmed) {
        const filtered = next.filter((item) => item.label !== label);
        return {
          ...prev,
          [targetSubject]: { ...prev[targetSubject], modules: filtered },
        };
      }

      const foundIndex = next.findIndex((item) => item.label === label);
      if (foundIndex >= 0) {
        next[foundIndex] = { label, url: trimmed };
      } else {
        next.push({ label, url: trimmed });
      }

      return {
        ...prev,
        [targetSubject]: { ...prev[targetSubject], modules: next },
      };
    });
  };

  if (!isClient) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin Resources</h1>
          <p className="text-gray-600 text-center mb-6">Please login from Admin Panel first.</p>
          <a
            href="/admin"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  const currentSubjectCode = selectedSubject || subjects[0].code;
  const currentSubject = subjects.find((s) => s.code === currentSubjectCode);
  const currentResources = resources[currentSubjectCode] || {
    modules: [],
    modelPapers: [],
    pyq: [],
    assignments: [],
    internals: [],
    labManuals: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Resources</h1>
            <p className="text-slate-400 text-sm mt-1">Logged in as: {email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.code}
                onClick={() => setSelectedSubject(subject.code)}
                className={`p-3 rounded-lg font-medium transition ${
                  currentSubjectCode === subject.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-gray-900 hover:bg-slate-200'
                }`}
              >
                {subject.code}
              </button>
            ))}
          </div>
        </div>

        {currentSubject && (
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded p-4 mb-6">
            <h3 className="font-bold text-gray-900">{currentSubject.name}</h3>
            <p className="text-sm text-gray-600">Faculty: {currentSubject.faculty}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Global Syllabus Copy</h2>
          <p className="text-sm text-gray-600 mb-4">One PDF for all Semester 6 AIML subjects.</p>
          <input
            type="url"
            value={syllabusLink}
            onChange={(e) => setSyllabusLink(e.target.value)}
            placeholder="Paste syllabus PDF link..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-blue-600" />
              {currentSubjectCode === "BCSL606" ? "Program Notes (1-10)" : "Module Notes (1-5)"}
            </h3>

            <div className="grid gap-3">
              {Array.from({ length: currentSubjectCode === "BCSL606" ? 10 : 5 }).map((_, index) => {
                const label = `${currentSubjectCode === "BCSL606" ? "Program" : "Module"} ${index + 1}`;
                const existing = currentResources.modules.find((item) => item.label === label);
                return (
                  <div key={label} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                    <div className="text-sm font-semibold text-slate-700">{label}</div>
                    <input
                      type="url"
                      value={existing?.url ?? ""}
                      onChange={(e) =>
                        handleModuleChange(index, e.target.value, currentSubjectCode === "BCSL606" ? "Program" : "Module")
                      }
                      placeholder="Paste module notes link..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-indigo-600" />
              Model Question Papers
            </h3>

            <div className="grid gap-3">
              {currentResources.modelPapers.map((item, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleListItemChange('modelPapers', idx, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleListItemChange('modelPapers', idx, 'url', e.target.value)}
                    placeholder="Paste model paper link..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveListItem('modelPapers', idx)}
                    className="w-full sm:w-auto px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddListItem('modelPapers')}
                className="w-full sm:w-auto justify-self-start px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Model Paper
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-purple-600" />
              Previous Year Questions (PYQ)
            </h3>

            <div className="grid gap-3">
              {currentResources.pyq.map((item, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleListItemChange('pyq', idx, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleListItemChange('pyq', idx, 'url', e.target.value)}
                    placeholder="Paste PYQ link..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveListItem('pyq', idx)}
                    className="w-full sm:w-auto px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddListItem('pyq')}
                className="w-full sm:w-auto justify-self-start px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add PYQ
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-emerald-600" />
              Assignments
            </h3>

            <div className="grid gap-3">
              {currentResources.assignments.map((item, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleListItemChange('assignments', idx, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleListItemChange('assignments', idx, 'url', e.target.value)}
                    placeholder="Paste assignment link..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveListItem('assignments', idx)}
                    className="w-full sm:w-auto px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddListItem('assignments')}
                className="w-full sm:w-auto justify-self-start px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add Assignment
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-indigo-600" />
              Internals
            </h3>

            <div className="grid gap-3">
              {currentResources.internals.map((item, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleListItemChange('internals', idx, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleListItemChange('internals', idx, 'url', e.target.value)}
                    placeholder="Paste internal assessment link..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveListItem('internals', idx)}
                    className="w-full sm:w-auto px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddListItem('internals')}
                className="w-full sm:w-auto justify-self-start px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Internal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-slate-700" />
              Lab Manuals
            </h3>

            <div className="space-y-3 mb-4">
              {currentResources.labManuals.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1 truncate"
                  >
                    {item.label}
                  </a>
                  <button
                    onClick={() => handleRemoveResource('labManuals', idx)}
                    className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
              <input
                type="text"
                value={inputValues.labManualsLabel}
                onChange={(e) => setInputValues((prev) => ({ ...prev, labManualsLabel: e.target.value }))}
                placeholder="Label (e.g., Lab Manual)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={inputValues.labManualsUrl}
                onChange={(e) => setInputValues((prev) => ({ ...prev, labManualsUrl: e.target.value }))}
                placeholder="Paste lab manual link..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddResource('labManuals')}
                className="w-full sm:w-auto shrink-0 whitespace-nowrap min-w-[72px] px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className={`text-xs ${autoSaved ? 'text-emerald-200' : 'text-slate-400'}`}>
            {autoSaved ? 'Auto-saved' : ' '}
          </span>
          <button
            onClick={handleSaveResources}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
