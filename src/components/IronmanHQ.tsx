import { LineChart } from "@tremor/react";
import { Droplets, Flame, Route, Target } from "lucide-react";
import type { MonthRow } from "@/lib/strava-stats";
import { formatDuration } from "@/lib/strava-stats";

type Props = {
  months: MonthRow[];
  monthTotals: { Swim: number; Bike: number; Run: number };
  monthTotalMiles: number;
  strengthMinutes: number;
};

const plan = [
  { phase: "Current block", value: "Build 2 · Week 11 of 20", meta: "Race: Ironman Boulder · June 14" },
  { phase: "Weekly target", value: "14–16 h", meta: "3 swims · 3 rides · 4 runs · 2 lifts" },
  { phase: "Key session", value: "Saturday long ride", meta: "4h30 with 2×20 min at threshold" },
  { phase: "Recovery", value: "Every 4th week", meta: "Volume reduced 40%, intensity retained" },
];

const fueling = [
  { label: "Carbs on the bike", value: "90 g/h", meta: "2 bottles mix + 1 gel per hour" },
  { label: "Carbs on the run", value: "60–70 g/h", meta: "Gel every 25 min, sip at aid stations" },
  { label: "Fluids", value: "750 ml/h", meta: "Scale up in heat above 80°F" },
  { label: "Sodium", value: "800 mg/h", meta: "Electrolyte tab per bottle" },
  { label: "Daily intake", value: "3,400 kcal", meta: "5–7 g carbs per kg body weight" },
];

export function IronmanHQ({ months, monthTotals, monthTotalMiles, strengthMinutes }: Props) {
  return (
    <div className="space-y-4">
      <section className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-label">Ironman HQ</p>
            <h2 className="mt-2 font-display text-lg font-medium">Monthly volume by discipline</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {([["Swim", monthTotals.Swim, "text-swim"], ["Bike", monthTotals.Bike, "text-bike"], ["Run", monthTotals.Run, "text-run"], ["Total", monthTotalMiles, "text-foreground"]] as const).map(([label, value, tone]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                <p className={`mt-1 font-display text-lg font-semibold ${tone}`}>{value.toFixed(1)} mi</p>
              </div>
            ))}
          </div>
        </div>
        <LineChart
          className="mt-6 h-64"
          data={months}
          index="label"
          categories={["Swim", "Bike", "Run"]}
          colors={["cyan", "teal", "lime"]}
          showGridLines={false}
          curveType="monotone"
          valueFormatter={(v) => `${v.toFixed(1)} mi`}
        />
        <p className="mt-3 text-[11px] text-muted-foreground">
          Strength this month: {formatDuration(strengthMinutes)}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Training plan</p>
              <h2 className="mt-2 font-display text-lg font-medium">Current block details</h2>
            </div>
            <Target className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-5 divide-y divide-border">
            {plan.map((item) => (
              <div key={item.phase} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm text-foreground">{item.phase}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{item.meta}</p>
                </div>
                <p className="whitespace-nowrap font-display text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Nutrition</p>
              <h2 className="mt-2 font-display text-lg font-medium">Race fueling protocol</h2>
            </div>
            <Droplets className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-5 divide-y divide-border">
            {fueling.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{item.meta}</p>
                </div>
                <p className="whitespace-nowrap font-display text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <Flame className="size-3.5" /> Practice race fueling on every key session.
          </div>
        </div>
      </section>

      <section className="panel flex items-center gap-3 p-5 text-[11px] text-muted-foreground">
        <Route className="size-4" /> Volume is pulled live from your Strava activities.
      </section>
    </div>
  );
}
