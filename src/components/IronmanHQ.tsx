import { LineChart } from "@tremor/react";
import { Beaker, Droplets, Flame, Route, Target, Timer } from "lucide-react";
import type { MonthRow } from "@/lib/strava-stats";
import { formatDuration } from "@/lib/strava-stats";
import { AICoach } from "@/components/AICoach";

type Props = {
  months: MonthRow[];
  monthTotals: { Swim: number; Bike: number; Run: number };
  monthTotalMiles: number;
  strengthMinutes: number;
};

type Cell = { primary: string; secondary?: string; timed?: boolean };

const columns = [
  "Mon · Swim",
  "Tue · Indoor Bike + Run",
  "Wed · Swim",
  "Thu · Run",
  "Fri · Outdoor Bike",
  "Sat · Brick",
];

const weeks: { phase: string; dates: string; cells: Cell[] }[] = [
  {
    phase: "Build",
    dates: "Aug 3–9",
    cells: [
      { primary: "1,100 yds" },
      { primary: "15 mi bike", secondary: "27 min run · 3 mi target", timed: true },
      { primary: "1,500 yds" },
      { primary: "4 mi run" },
      { primary: "70 min ride", secondary: "20 mi target", timed: true },
      { primary: "45 mi bike + 4 mi run" },
    ],
  },
  {
    phase: "Build",
    dates: "Aug 10–16",
    cells: [
      { primary: "1,200 yds" },
      { primary: "20 mi bike", secondary: "36 min run · 4 mi target", timed: true },
      { primary: "1,700 yds" },
      { primary: "5 mi run" },
      { primary: "70 min ride", secondary: "20 mi target", timed: true },
      { primary: "45 mi bike + 5 mi run" },
    ],
  },
  {
    phase: "Build",
    dates: "Aug 17–23",
    cells: [
      { primary: "1,300 yds" },
      { primary: "20 mi bike", secondary: "36 min run · 4 mi target", timed: true },
      { primary: "1,900 yds" },
      { primary: "5 mi run" },
      { primary: "70 min ride", secondary: "20 mi target", timed: true },
      { primary: "50 mi bike + 6 mi run" },
    ],
  },
  {
    phase: "Peak",
    dates: "Aug 24–30",
    cells: [
      { primary: "1,300 yds" },
      { primary: "25 mi bike", secondary: "36 min run · 4 mi target", timed: true },
      { primary: "2,100 yds" },
      { primary: "6 mi run" },
      { primary: "70 min ride", secondary: "20 mi target", timed: true },
      { primary: "55 mi bike + 7 mi run" },
    ],
  },
  {
    phase: "Peak",
    dates: "Aug 31–Sep 6",
    cells: [
      { primary: "1,400 yds" },
      { primary: "25 mi bike", secondary: "45 min run · 5 mi target", timed: true },
      { primary: "2,200 yds" },
      { primary: "6 mi run" },
      { primary: "70 min ride", secondary: "20 mi target", timed: true },
      { primary: "55 mi bike + 8 mi run" },
    ],
  },
  {
    phase: "Race",
    dates: "Sep 7–11",
    cells: [
      { primary: "800 yds" },
      { primary: "10 mi bike", secondary: "18 min run · 2 mi target", timed: true },
      { primary: "Rest" },
      { primary: "20 min easy spin", timed: true },
      { primary: "Race prep" },
      { primary: "Sep 11 · 70.3 Race" },
    ],
  },
];

const masterMix = [
  { label: "Pink Himalayan Salt", value: "250 g" },
  { label: "Potassium Chloride", value: "40 g" },
  { label: "Magnesium Malate", value: "40 g" },
];

const drinkMix = [
  {
    duration: "60 Min",
    items: ["1/4 c. Malto", "1.5 tbsp Fructose", "1/4 tsp Pink Salt", "1/8 tsp Pot. Chloride"],
  },
  {
    duration: "90 Min",
    items: ["1/3 c. + 1 tbsp Malto", "2.5 tbsp Fructose", "3/8 tsp Pink Salt", "1/8 tsp Pot. Chloride"],
  },
  {
    duration: "120 Min",
    items: ["1/2 c. Malto", "3 tbsp Fructose", "1/2 tsp Pink Salt", "1/4 tsp Pot. Chloride"],
  },
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

      <section className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Training plan</p>
            <h2 className="mt-2 font-display text-lg font-medium">6-week progressive peak · 70.3 on Sep 11</h2>
          </div>
          <Target className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[62rem] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-border bg-card px-3 py-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Week
                </th>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-border px-3 py-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week.dates} className="align-top">
                  <td className="sticky left-0 z-10 border-b border-border bg-card px-3 py-4">
                    <p
                      className={`text-[10px] uppercase tracking-[0.14em] ${
                        week.phase === "Race" ? "text-primary" : week.phase === "Peak" ? "text-run" : "text-muted-foreground"
                      }`}
                    >
                      {week.phase}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-sm text-foreground">{week.dates}</p>
                  </td>
                  {week.cells.map((cell, index) => (
                    <td key={index} className="border-b border-border px-3 py-4">
                      <p
                        className={`flex items-center gap-1.5 text-sm ${
                          cell.timed ? "font-display text-foreground" : "text-foreground"
                        }`}
                      >
                        {cell.timed && <Timer className="size-3.5 shrink-0 text-primary" />}
                        {cell.primary}
                      </p>
                      {cell.secondary && (
                        <p className="mt-1 text-[11px] text-muted-foreground">{cell.secondary}</p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Timer className="size-3.5 text-primary" /> Tuesday and Friday sessions are run to time first — mileage is a secondary target.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Nutrition</p>
              <h2 className="mt-2 font-display text-lg font-medium">Bulk supplement protocol</h2>
            </div>
            <Beaker className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Electrolyte Master Mix · 100 servings
          </p>
          <div className="mt-3 divide-y divide-border">
            {masterMix.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 py-3">
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="font-display text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <Droplets className="size-3.5" /> Batch once, scoop per bottle.
          </div>
        </div>

        <div className="panel p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Intra-workout</p>
              <h2 className="mt-2 font-display text-lg font-medium">Drink mix by duration</h2>
            </div>
            <Flame className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {drinkMix.map((mix) => (
              <div key={mix.duration} className="rounded-md border border-border bg-secondary/30 p-4">
                <p className="font-display text-sm font-semibold text-primary">{mix.duration}</p>
                <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                  {mix.items.map((item) => (
                    <p key={item} className="text-[11px] text-muted-foreground">
                      · {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AICoach />

      <section className="panel flex items-center gap-3 p-5 text-[11px] text-muted-foreground">
        <Route className="size-4" /> Volume is pulled live from your Strava activities.
      </section>
    </div>
  );
}
