import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Activity, Bike, Dumbbell, Footprints, RefreshCw, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStravaActivities, type StravaActivity } from "@/lib/strava.functions";

function iconFor(type: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("swim")) return Waves;
  if (t.includes("ride") || t.includes("bike") || t.includes("cycl")) return Bike;
  if (t.includes("run") || t.includes("walk")) return Footprints;
  if (t.includes("weight") || t.includes("strength")) return Dumbbell;
  return Activity;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Row({ activity }: { activity: StravaActivity }) {
  const Icon = iconFor(activity.type);
  return (
    <tr className="border-t border-border">
      <td className="py-3 pr-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border bg-secondary text-muted-foreground">
            <Icon className="size-3.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-foreground">{activity.name}</span>
            <span className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {activity.type ?? "Activity"}
            </span>
          </span>
        </div>
      </td>
      <td className="py-3 pr-3 text-right font-mono text-xs text-foreground">
        {activity.distance_miles != null ? `${activity.distance_miles.toFixed(2)} mi` : "—"}
      </td>
      <td className="py-3 pr-3 text-right font-mono text-xs text-foreground">
        {activity.duration_min != null ? `${activity.duration_min.toFixed(0)} min` : "—"}
      </td>
      <td className="hidden py-3 pr-3 text-right font-mono text-xs text-muted-foreground sm:table-cell">
        {activity.avg_hr != null ? `${Math.round(activity.avg_hr)} bpm` : "—"}
      </td>
      <td className="py-3 text-right font-mono text-xs text-muted-foreground">
        {formatDate(activity.date)}
      </td>
    </tr>
  );
}

export function WorkoutHistory() {
  const fetchActivities = useServerFn(getStravaActivities);
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ["strava-activities"],
    queryFn: () => fetchActivities(),
  });

  return (
    <div className="panel p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-label">Strava sync</p>
          <h2 className="mt-2 font-display text-lg font-medium">Workout history</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-secondary/40 text-xs"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        {isPending ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data?.error ? (
          <p className="py-8 text-center text-xs text-muted-foreground">{data.error}</p>
        ) : data && data.activities.length > 0 ? (
          <table className="w-full min-w-[30rem] border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="pb-2 text-left font-normal">Activity</th>
                <th className="pb-2 text-right font-normal">Distance</th>
                <th className="pb-2 text-right font-normal">Time</th>
                <th className="hidden pb-2 text-right font-normal sm:table-cell">Avg HR</th>
                <th className="pb-2 text-right font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.activities.map((activity, index) => (
                <Row key={`${activity.name}-${index}`} activity={activity} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">No recent activities.</p>
        )}
      </div>
    </div>
  );
}
