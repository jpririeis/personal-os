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

export const getStravaActivities = createServerFn({ method: "GET" }).handler(
  async (): Promise<StravaResult> => {
    const clientId = process.env["STRAVA_CLIENT_ID"];
    const clientSecret = process.env["STRAVA_CLIENT_SECRET"];
    const refreshToken = process.env["STRAVA_REFRESH_TOKEN"];

    if (!clientId || !clientSecret || !refreshToken) {
      return { activities: [], error: "Strava credentials are not configured." };
    }

    try {
      const authRes = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!authRes.ok) {
        return { activities: [], error: "Could not authenticate with Strava." };
      }

      const auth = (await authRes.json()) as { access_token?: string };
      if (!auth.access_token) {
        return { activities: [], error: "Strava did not return an access token." };
      }

      const res = await fetch(
        "https://www.strava.com/api/v3/athlete/activities?per_page=10",
        { headers: { Authorization: `Bearer ${auth.access_token}` } },
      );
      if (!res.ok) return { activities: [], error: `Strava API returned ${res.status}` };

      const list = (await res.json()) as Array<Record<string, unknown>>;
      const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
      const str = (v: unknown) => (typeof v === "string" ? v : null);

      const activities: StravaActivity[] = (Array.isArray(list) ? list : []).map((a) => {
        const distance = num(a["distance"]);
        const movingTime = num(a["moving_time"]);
        return {
          name: str(a["name"]) ?? "Untitled activity",
          type: str(a["sport_type"]) ?? str(a["type"]),
          distance_miles: distance != null ? distance / 1609.34 : null,
          duration_min: movingTime != null ? movingTime / 60 : null,
          avg_hr: num(a["average_heartrate"]),
          date: str(a["start_date_local"]),
        };
      });

      return { activities, error: null };
    } catch {
      return { activities: [], error: "Could not reach Strava." };
    }
  },
);
