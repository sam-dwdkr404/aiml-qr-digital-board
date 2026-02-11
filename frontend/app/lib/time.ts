import { timetableByDay, timetableDays, type DayName, type TimetableEntry } from "./data";

type LiveStatus = {
  status: "in-progress" | "next" | "none";
  currentDay: DayName | "Sunday";
  currentTimeLabel: string;
  entry?: TimetableEntry;
  nextEntry?: TimetableEntry & { day: DayName };
  minutesLeft?: number;
  minutesToNext?: number;
};

const timeZone = "Asia/Kolkata";

const toMinutes = (time: string) => {
  const [rawHour, rawMinute] = time.split(":");
  let hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (hour <= 4) {
    hour += 12;
  }
  return hour * 60 + minute;
};

const formatCurrentTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getDayName = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" }).format(date);
};

const getTimeParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return { hour, minute };
};

const diffMinutes = (from: number, to: number) => Math.max(0, to - from);

export const getLiveStatus = (): LiveStatus => {
  const now = new Date();
  const dayName = getDayName(now);
  const currentTimeLabel = formatCurrentTime(now);
  const { hour, minute } = getTimeParts(now);
  const currentMinutes = hour * 60 + minute;

  if (!timetableDays.includes(dayName as DayName)) {
    const nextDay = timetableDays[0];
    return {
      status: "none",
      currentDay: "Sunday",
      currentTimeLabel,
      nextEntry: { ...timetableByDay[nextDay][0], day: nextDay },
    };
  }

  const day = dayName as DayName;
  const entries = timetableByDay[day];

  const active = entries.find((entry) => {
    const start = toMinutes(entry.start);
    const end = toMinutes(entry.end);
    return currentMinutes >= start && currentMinutes < end;
  });

  if (active) {
    const end = toMinutes(active.end);
    return {
      status: "in-progress",
      currentDay: day,
      currentTimeLabel,
      entry: active,
      minutesLeft: diffMinutes(currentMinutes, end),
    };
  }

  const nextEntry = entries.find((entry) => currentMinutes < toMinutes(entry.start));
  if (nextEntry) {
    const start = toMinutes(nextEntry.start);
    return {
      status: "next",
      currentDay: day,
      currentTimeLabel,
      nextEntry: { ...nextEntry, day },
      minutesToNext: diffMinutes(currentMinutes, start),
    };
  }

  const nextDayIndex = timetableDays.indexOf(day) + 1;
  const upcomingDay = timetableDays[nextDayIndex] ?? timetableDays[0];
  const upcomingEntry = timetableByDay[upcomingDay][0];

  return {
    status: "none",
    currentDay: day,
    currentTimeLabel,
    nextEntry: { ...upcomingEntry, day: upcomingDay },
  };
};

export const getIndiaDay = () => {
  const now = new Date();
  const dayName = getDayName(now);
  if (timetableDays.includes(dayName as DayName)) {
    return dayName as DayName;
  }
  return "Sunday";
};

export const getCurrentSlotKey = () => {
  const now = new Date();
  const { hour, minute } = getTimeParts(now);
  const currentMinutes = hour * 60 + minute;

  if (currentMinutes >= toMinutes("9:30") && currentMinutes < toMinutes("10:30")) return "9:30";
  if (currentMinutes >= toMinutes("10:30") && currentMinutes < toMinutes("11:30")) return "10:30";
  if (currentMinutes >= toMinutes("11:45") && currentMinutes < toMinutes("12:45")) return "11:45";
  if (currentMinutes >= toMinutes("12:45") && currentMinutes < toMinutes("1:30")) return "12:45";
  if (currentMinutes >= toMinutes("2:15") && currentMinutes < toMinutes("4:15")) return "2:15";

  return null;
};

export const getTodayTimeline = () => {
  const now = new Date();
  const dayName = getDayName(now);
  if (!timetableDays.includes(dayName as DayName)) {
    return { day: "Sunday" as const, slots: [] as TimetableEntry[] };
  }
  const day = dayName as DayName;
  return { day, slots: timetableByDay[day] };
};

export const getIndiaDateLabel = () => {
  const now = new Date();
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);
};
