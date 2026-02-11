export const collegeInfo = {
  collegeName: "A. G. M Rural College of Engineering and Technology, Varur",
  trust: "S. D. M Jainmatt Trust",
  affiliation: [
    "Approved by AICTE, New Delhi",
    "Affiliated to VTU, Belgaum",
    "Recognized by State Government",
  ],
  department: "Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
  academicYear: "2025-2026 (Even Semester)",
  semester: "Semester 6",
  wef: "27-01-2026",
};

export const authorities = [
  { role: "Class Coordinator", name: "Not assigned", contact: "NIL" },
  { role: "HOD", name: "Mr. Irshad A Gorikhan", contact: "9986715099" },
  { role: "Dean Academics", name: "Dr. B. N. Patil", contact: "9980711773" },
];

export const timeSlots = [
  { slot: "1", time: "9:30 - 10:30" },
  { slot: "2", time: "10:30 - 11:30" },
  { slot: "Break", time: "11:30 - 11:45" },
  { slot: "3", time: "11:45 - 12:45" },
  { slot: "4", time: "12:45 - 1:30" },
  { slot: "Lunch", time: "1:30 - 2:15" },
  { slot: "5", time: "2:15 - 3:15" },
  { slot: "6", time: "3:15 - 4:15" },
];

export const timetableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export type DayName = (typeof timetableDays)[number];

export type TimetableEntry = {
  title: string;
  start: string;
  end: string;
  portion?: string;
  code?: string;
};

export const timetableByDay: Record<DayName, TimetableEntry[]> = {
  Monday: [
    { title: "BXX654x", start: "9:30", end: "10:30" },
    { title: "BIS613D", start: "10:30", end: "11:30" },
    { title: "BCO601", start: "11:45", end: "12:45" },
    { title: "BCS602", start: "12:45", end: "1:30" },
    { title: "Project Work", start: "2:15", end: "4:15" },
  ],
  Tuesday: [
    { title: "BCS602", start: "9:30", end: "10:30" },
    { title: "BCO601", start: "10:30", end: "11:30" },
    { title: "BIS613D", start: "11:45", end: "12:45" },
    { title: "BIKS609", start: "12:45", end: "1:30" },
    { title: "DevOps Lab", start: "2:15", end: "4:15" },
  ],
  Wednesday: [
    { title: "BCO601", start: "9:30", end: "10:30" },
    { title: "BCS602", start: "10:30", end: "11:30" },
    { title: "Add-on", start: "11:45", end: "12:45" },
    { title: "BXX654x", start: "12:45", end: "1:30" },
    { title: "Microcontrollers and Embedded Systems Lab", start: "2:15", end: "4:15" },
  ],
  Thursday: [
    { title: "Machine Learning Lab", start: "9:30", end: "11:30" },
    { title: "BIKS609", start: "11:45", end: "12:45" },
    { title: "BIS613D", start: "12:45", end: "1:30" },
    { title: "BCO601", start: "2:15", end: "3:15" },
    { title: "BCS602", start: "3:15", end: "4:15" },
  ],
  Friday: [
    { title: "BIS613D", start: "9:30", end: "10:30" },
    { title: "BXX654x", start: "10:30", end: "11:30" },
    { title: "BCO601", start: "11:45", end: "12:45" },
    { title: "BCS602", start: "12:45", end: "1:30" },
    { title: "BCI685 - Project Phase-I", start: "2:15", end: "4:15" },
  ],
  Saturday: [
    { title: "BCS602", start: "9:30", end: "10:30" },
    { title: "BCO601", start: "10:30", end: "11:30" },
    { title: "BPEK658", start: "11:45", end: "12:45" },
    { title: "BPEK658", start: "12:45", end: "1:30" },
    { title: "Departmental Activity", start: "2:15", end: "4:15" },
  ],
};

export const timetableGridSlots = [
  { key: "9:30", label: "9:30" },
  { key: "10:30", label: "10:30" },
  { key: "11:45", label: "11:45" },
  { key: "12:45", label: "12:45" },
  { key: "2:15", label: "2:15-4:15" },
];

export const timetableGrid: Record<DayName, Record<string, string>> = {
  Monday: {
    "9:30": "BXX654x",
    "10:30": "BIS613D",
    "11:45": "BCO601",
    "12:45": "BCS602",
    "2:15": "Project Work",
  },
  Tuesday: {
    "9:30": "BCS602",
    "10:30": "BCO601",
    "11:45": "BIS613D",
    "12:45": "BIKS609",
    "2:15": "DevOps Lab",
  },
  Wednesday: {
    "9:30": "BCO601",
    "10:30": "BCS602",
    "11:45": "Add-on",
    "12:45": "BXX654x",
    "2:15": "Microcontrollers and Embedded Systems Lab",
  },
  Thursday: {
    "9:30": "Machine Learning Lab",
    "10:30": "Machine Learning Lab",
    "11:45": "BIKS609",
    "12:45": "BIS613D",
    "2:15": "BCO601",
  },
  Friday: {
    "9:30": "BIS613D",
    "10:30": "BXX654x",
    "11:45": "BCO601",
    "12:45": "BCS602",
    "2:15": "BCI685 - Project Phase-I",
  },
  Saturday: {
    "9:30": "BCS602",
    "10:30": "BCO601",
    "11:45": "BPEK658",
    "12:45": "BPEK658",
    "2:15": "Departmental Activity",
  },
};

export const subjects = [
  {
    code: "BCS602",
    name: "Machine Learning",
    faculty: "Dr. Preeti Savant",
    accent: "#8b5cf6",
    icon: "ML",
    type: "core",
  },
  {
    code: "BIS613D",
    name: "Cloud Computing and Security",
    faculty: "Mrs. Kavita N",
    accent: "#d6c3a6",
    icon: "CC",
    type: "core",
  },
  {
    code: "BCO601",
    name: "Microcontrollers and Embedded Systems",
    faculty: "Mrs. Vidyashree H",
    accent: "#f97316",
    icon: "MC",
    type: "core",
  },
  {
    code: "BIKS609",
    name: "Indian Knowledge System",
    faculty: "Mrs. Shailaja",
    accent: "#7fff00",
    icon: "IK",
    type: "core",
  },
  {
    code: "BXX654x",
    name: "Open Elective Course",
    faculty: "E and C",
    accent: "#6b7280",
    icon: "OE",
    type: "core",
  },
  {
    code: "BPEK658",
    name: "Physical Education",
    faculty: "Mr. Santosh B",
    accent: "#10b981",
    icon: "PE",
    type: "core",
  },
  {
    code: "BCI685",
    name: "Project Phase-I",
    faculty: "Mr. Vinaykumar Beelagi",
    accent: "#ec4899",
    icon: "PR",
    type: "project",
  },
  {
    code: "BCSL606",
    name: "Machine Learning Lab",
    faculty: "Dr. Preeti Savant",
    accent: "#a855f7",
    icon: "LB",
    type: "lab",
  },
  {
    code: "BCSL657D",
    name: "DevOps Lab",
    faculty: "Mrs. Sushma",
    accent: "#0ea5e9",
    icon: "DL",
    type: "lab",
  },
  {
    code: "Add-on",
    name: "Add-on Course",
    faculty: "Mrs. Shailaja",
    accent: "#94a3b8",
    icon: "AD",
    type: "core",
  },
];

export type ResourceLink = {
  label: string;
  url: string;
};

export type SubjectResource = {
  notes?: ResourceLink[];
  pyq?: ResourceLink[];
  solutions?: ResourceLink[];
  modelPapers?: ResourceLink[];
  modules?: ResourceLink[];
  assignments?: ResourceLink[];
  internals?: ResourceLink[];
  labManual?: ResourceLink[];
  labManuals?: ResourceLink[];
};

export const subjectResources: Record<string, SubjectResource> = {
  BCS602: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  BIS613D: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [{ label: "BIS613D Model Paper", url: "https://vtu.ac.in/pdf/QP/BIS613D.pdf" }],
    modules: [],
    assignments: [],
    internals: [],
  },
  BCO601: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  BXX654x: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  BIKS609: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  BPEK658: {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  "Add-on": {
    notes: [],
    pyq: [],
    solutions: [],
    modelPapers: [],
    modules: [],
    assignments: [],
    internals: [],
  },
  BCSL606: {
    labManual: [],
    labManuals: [],
    assignments: [],
    internals: [],
  },
  BCSL657D: {
    labManual: [],
    labManuals: [],
    assignments: [],
    internals: [],
  },
  BCI685: {
    labManual: [],
    labManuals: [],
    assignments: [],
    internals: [],
  },
};

export const labs = [
  { slug: "machine-learning-lab", name: "Machine Learning Lab", mentor: "Dr. Preeti Savant" },
  { slug: "devops-lab", name: "DevOps Lab", mentor: "Mrs. Sushma" },
  {
    slug: "microcontrollers-lab",
    name: "Microcontrollers and Embedded Systems Lab",
    mentor: "Mrs. Vidyashree H",
  },
  { slug: "project-phase-1", name: "Project Phase-I", mentor: "Mr. Vinaykumar Beelagi" },
];

export const resourceList = [
  "Module Notes (Drive)",
  "Previous Year Question Papers",
  "Solutions",
  "Model Papers",
  "Assignments",
  "Lab Manual (if applicable)",
];

// CIE Papers Data
export const ciePapers = [
  {
    id: 1,
    name: "CIE 1",
    papers: [
      {
        id: "cie1-qp",
        name: "Question Paper",
        url: "/pdfs/CIE1_QuestionPaper.pdf",
        available: true,
      },
      {
        id: "cie1-sol",
        name: "Solution",
        url: "/pdfs/CIE1_Solution.pdf",
        available: true,
      },
    ],
  },
  {
    id: 2,
    name: "CIE 2",
    papers: [
      {
        id: "cie2-qp",
        name: "Question Paper",
        url: "/pdfs/CIE2_QuestionPaper.pdf",
        available: false,
      },
      {
        id: "cie2-sol",
        name: "Solution",
        url: "/pdfs/CIE2_Solution.pdf",
        available: false,
      },
    ],
  },
];

// Assignments Data
export const assignmentsList = [
  {
    id: 1,
    title: "Neural Networks Assignment",
    subject: "BCS602",
    subjectName: "Machine Learning",
    description: "Implement a 3-layer neural network from scratch",
    dueDate: "2026-02-10",
    url: "/pdfs/Assignment1_NeuralNetworks.pdf",
    faculty: "Dr. Preeti Savant",
  },
  {
    id: 2,
    title: "Cloud Security Lab Writeup",
    subject: "BIS613D",
    subjectName: "Cloud Computing and Security",
    description: "Write-up for cloud security implementation lab",
    dueDate: "2026-02-12",
    url: "/pdfs/Assignment2_CloudSecurity.pdf",
    faculty: "Mrs. Kavita N",
  },
  {
    id: 3,
    title: "Microcontroller Programming",
    subject: "BCO601",
    subjectName: "Microcontrollers and Embedded Systems",
    description: "ARM7 assembly programming assignment",
    dueDate: "2026-02-15",
    url: "/pdfs/Assignment3_Microcontroller.pdf",
    faculty: "Mrs. Vidyashree H",
  },
  {
    id: 4,
    title: "Indian Knowledge Systems Essay",
    subject: "BIKS609",
    subjectName: "Indian Knowledge System",
    description: "Essay on ancient Indian contributions to mathematics",
    dueDate: "2026-02-18",
    url: "/pdfs/Assignment4_IKS.pdf",
    faculty: "Mrs. Shailaja",
  },
  {
    id: 5,
    title: "Open Elective Project Proposal",
    subject: "BXX654x",
    subjectName: "Open Elective Course",
    description: "Project proposal and literature review",
    dueDate: "2026-02-20",
    url: "/pdfs/Assignment5_Elective.pdf",
    faculty: "E and C",
  },
];
