import type { StravaActivity } from "@/lib/strava.functions";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type WeekRow = { day: string; Swim: number; Bike: number; Run: number };
export type StrengthRow = { day: string; Minutes: number };

function dayIndex(date: Date) {
  return (date.getDay() + 6) % 7; // Monday = 0
}

function startOfWeek(now: Date) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - dayIndex(d));
  return d;
}

function discipline(type: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("swim")) return "Swim" as const;
  if (t.includes("ride") || t.includes("bike") || t.includes("cycl")) return "Bike" as const;
  if (t.includes("run") || t.includes("walk") || t.includes("hike")) return "Run" as const;
  if (t.includes("weight") || t.includes("strength") || t.includes("workout") || t.includes("crossfit"))
    return "Strength" as const;
  return null;
}

export function buildWeekStats(activities: StravaActivity[], now = new Date()) {
  const weekStart = startOfWeek(now);
  const mileage: WeekRow[] = DAYS.map((day) => ({ day, Swim: 0, Bike: 0, Run: 0 }));
  const strength: StrengthRow[] = DAYS.map((day) => ({ day, Minutes: 0 }));
  const totals = { Swim: 0, Bike: 0, Run: 0 };
  let totalMiles = 0;
  let strengthMinutes = 0;
  let strengthSessions = 0;

  for (const activity of activities) {
    if (!activity.date) continue;
    const date = new Date(activity.date);
    if (Number.isNaN(date.getTime()) || date < weekStart) continue;
    const i = dayIndex(date);
    const kind = discipline(activity.type);
    if (kind === "Strength") {
      const minutes = activity.duration_min ?? 0;
      strength[i]!.Minutes += Math.round(minutes);
      strengthMinutes += minutes;
      strengthSessions += 1;
    } else if (kind) {
      const miles = activity.distance_miles ?? 0;
      mileage[i]![kind] += Number(miles.toFixed(2));
      totals[kind] += miles;
      totalMiles += miles;
    }
  }

  return {
    mileage,
    strength,
    totals,
    totalMiles,
    strengthMinutes,
    strengthSessions,
  };
}

export type MonthRow = { label: string; Swim: number; Bike: number; Run: number };

export function buildMonthStats(activities: StravaActivity[], now = new Date()) {
  const months: MonthRow[] = [];
  const index = new Map<string, MonthRow>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const row: MonthRow = {
      label: d.toLocaleDateString(undefined, { month: "short" }),
      Swim: 0,
      Bike: 0,
      Run: 0,
    };
    months.push(row);
    index.set(key, row);
  }

  let strengthMinutes = 0;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const activity of activities) {
    if (!activity.date) continue;
    const date = new Date(activity.date);
    if (Number.isNaN(date.getTime())) continue;
    const kind = discipline(activity.type);
    if (kind === "Strength") {
      if (date >= monthStart) strengthMinutes += activity.duration_min ?? 0;
      continue;
    }
    if (!kind) continue;
    const row = index.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (!row) continue;
    row[kind] = Number((row[kind] + (activity.distance_miles ?? 0)).toFixed(2));
  }

  const current = months[months.length - 1]!;
  return {
    months,
    strengthMinutes,
    monthTotals: { Swim: current.Swim, Bike: current.Bike, Run: current.Run },
    monthTotalMiles: current.Swim + current.Bike + current.Run,
  };
}


export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
