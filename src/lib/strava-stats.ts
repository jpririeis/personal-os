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
      totalMiles += miles;
    }
  }

  return {
    mileage,
    strength,
    totalMiles,
    strengthMinutes,
    strengthSessions,
  };
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
