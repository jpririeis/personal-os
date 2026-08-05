import { createServerFn } from "@tanstack/react-start";

export type StravaActivity = {
  name: string;
  type: string | null;
  distance_miles: number | null;
  duration_min: number | null;
  avg_hr: number | null;
  date: string | null;
};

export type StravaResult = { activities: StravaActivity[]; error: string | null };

const ENDPOINT = "https://personal-rm5p99ihq-jayden-54ce.vercel.app/api/strava";

export const getStravaActivities = createServerFn({ method: "GET" }).handler(
  async (): Promise<StravaResult> => {
    try {
      const res = await fetch(ENDPOINT, {
        headers: { Accept: "application/json" },
        redirect: "manual",
      });

      if (res.status >= 300 && res.status < 400) {
        return {
          activities: [],
          error:
            "Vercel Deployment Protection is blocking this endpoint. Disable it (or use your production domain) to load activities.",
        };
      }
      if (!res.ok) return { activities: [], error: `Strava API returned ${res.status}` };

      const raw = (await res.json()) as unknown;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { activities?: unknown })?.activities)
          ? ((raw as { activities: unknown[] }).activities)
          : [];

      const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
      const str = (v: unknown) => (typeof v === "string" ? v : null);

      const activities: StravaActivity[] = list.map((item) => {
        const a = item as Record<string, unknown>;
        return {
          name: str(a["name"]) ?? "Untitled activity",
          type: str(a["type"]),
          distance_miles: num(a["distance_miles"]),
          duration_min: num(a["duration_min"]),
          avg_hr: num(a["avg_hr"]),
          date: str(a["date"]),
        };
      });

      return { activities, error: null };
    } catch {
      return { activities: [], error: "Could not reach the Strava endpoint." };
    }
  },
);
