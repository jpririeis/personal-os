import { createFileRoute } from "@tanstack/react-router";
import { BarChart, SparkAreaChart } from "@tremor/react";
import { Activity, ArrowRightLeft, Bike, BookOpen, CalendarDays, Check, ChevronRight, CircleUserRound, Dumbbell, Flame, GraduationCap, LayoutDashboard, MoonStar, Play, Radio, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Apex OS — Personal Performance Dashboard" },
    { name: "description", content: "A private performance dashboard for training, habits, content, and daily execution." },
    { property: "og:title", content: "Apex OS — Personal Performance Dashboard" },
    { property: "og:description", content: "A private performance dashboard for training, habits, content, and daily execution." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Dashboard,
});

const weeklyMileage = [
  { day: "Mon", Swim: 1.8, Bike: 22, Run: 4.2 }, { day: "Tue", Swim: 0, Bike: 31, Run: 5.8 },
  { day: "Wed", Swim: 2.4, Bike: 0, Run: 8.1 }, { day: "Thu", Swim: 1.5, Bike: 26, Run: 0 },
  { day: "Fri", Swim: 0, Bike: 18, Run: 6.4 }, { day: "Sat", Swim: 3.1, Bike: 44, Run: 9.2 },
  { day: "Sun", Swim: 1.2, Bike: 12, Run: 3.7 },
];
const strengthData = [{ day: "Mon", Minutes: 45 }, { day: "Tue", Minutes: 0 }, { day: "Wed", Minutes: 62 }, { day: "Thu", Minutes: 35 }, { day: "Fri", Minutes: 52 }, { day: "Sat", Minutes: 20 }, { day: "Sun", Minutes: 0 }];
const followerData = [12040,12082,12110,12104,12168,12210,12256,12242,12310,12348,12422,12408,12496,12532,12588,12640,12618,12704,12790,12842,12828,12920,12984,13052,13120,13104,13202,13288,13340,13428].map((Followers, i) => ({ day: i + 1, Followers }));
const nav = [{ label: "Today (Briefing)", icon: LayoutDashboard }, { label: "Ironman HQ", icon: Activity }, { label: "Creator Studio", icon: Radio }, { label: "University", icon: GraduationCap }];
const initialHabits = [
  { id: 1, label: "Morning sunlight", note: "10 min outside", done: true }, { id: 2, label: "Deep work block", note: "90 min, phone away", done: true },
  { id: 3, label: "Mobility protocol", note: "Hips + ankles · 15 min", done: false }, { id: 4, label: "Read & annotate", note: "20 pages", done: false },
];
const schedule = [
  { time: "06:30", title: "Open water swim", meta: "Technique · 2.4 km", tone: "swim", icon: Activity },
  { time: "09:00", title: "Creator deep work", meta: "Edit Ironman film", tone: "creator", icon: Play },
  { time: "12:30", title: "Strength session", meta: "Lower body · 45 min", tone: "strength", icon: Dumbbell },
  { time: "15:00", title: "University seminar", meta: "Behavioral economics", tone: "study", icon: BookOpen },
  { time: "18:30", title: "Easy aerobic run", meta: "Zone 2 · 7.5 km", tone: "run", icon: Flame },
];

function Dashboard() {
  const [habits, setHabits] = useState(initialHabits);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const toggleHabit = (id: number) => setHabits((current) => current.map((habit) => habit.id === id ? { ...habit, done: !habit.done } : habit));
  return <div className="dark">
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
        <SidebarHeader className="h-20 justify-center border-b border-sidebar-border px-3"><div className="flex items-center gap-3 overflow-hidden px-1"><div className="grid size-8 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary"><MoonStar className="size-4" /></div><div className="min-w-0 group-data-[collapsible=icon]:hidden"><p className="truncate font-display text-sm font-semibold text-foreground">APEX OS</p><p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Private system</p></div></div></SidebarHeader>
        <SidebarContent className="px-2 py-5"><SidebarGroup className="p-0"><SidebarGroupContent><SidebarMenu className="gap-1.5">{nav.map((item, index) => <SidebarMenuItem key={item.label}><SidebarMenuButton isActive={index === 0} tooltip={item.label} className="h-10 text-xs"><item.icon /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-3"><div className="flex items-center gap-3 overflow-hidden px-1 py-2"><div className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><CircleUserRound className="size-4" /></div><div className="min-w-0 group-data-[collapsible=icon]:hidden"><p className="truncate text-xs font-medium">Alex Morgan</p><p className="text-[10px] text-muted-foreground">Endurance athlete</p></div></div></SidebarFooter><SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0 bg-background">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:px-7"><div className="flex items-center gap-3"><SidebarTrigger className="text-muted-foreground" /><div className="h-4 w-px bg-border" /><div><p className="font-display text-sm font-medium">Tuesday, August 4</p><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Build phase · Week 11</p></div></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="hidden sm:inline">Denver</span><span className="size-1.5 rounded-full bg-success shadow-[0_0_12px_var(--success)]" /><span>72°F</span></div></header>
        <main className="mx-auto w-full max-w-[1580px] space-y-4 p-4 lg:p-7">
          <section className="briefing-card relative overflow-hidden rounded-lg border border-border p-5 lg:p-7"><div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div className="max-w-3xl"><div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="size-3.5" /> Daily intelligence</div><h1 className="font-display text-2xl font-medium leading-tight text-foreground md:text-3xl">Your engine is ready. Protect the quality.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Sleep and HRV are trending above baseline. Hit the swim with intent, keep the strength work controlled, and reserve enough attention for your 9:00 creative block.</p></div><div className="grid grid-cols-3 gap-6 border-t border-border pt-5 lg:min-w-[330px] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">{[["Readiness","87","+4"],["Sleep","8h 12","94%"],["Load","Optimal","0.82"]].map(([label,value,delta]) => <div key={label}><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-lg font-semibold text-foreground">{value}</p><p className="mt-1 text-[10px] text-success">{delta}</p></div>)}</div></div></section>
          <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr_.8fr]">
            <MetricCard eyebrow="Endurance volume" title="64.2 mi" delta="12% vs last week" icon={<Bike className="size-4" />}><div className="mb-2 flex gap-4 text-[10px] text-muted-foreground">{[["bg-swim","Swim"],["bg-bike","Bike"],["bg-run","Run"]].map(([color,label]) => <span key={label} className="flex items-center gap-1.5"><i className={`size-1.5 rounded-full ${color}`} />{label}</span>)}</div><BarChart className="h-44" data={weeklyMileage} index="day" categories={["Swim", "Bike", "Run"]} colors={["cyan", "teal", "lime"]} stack showLegend={false} showYAxis={false} showGridLines={false} /></MetricCard>
            <MetricCard eyebrow="Strength training" title="3h 34m" delta="4 sessions" icon={<Dumbbell className="size-4" />}><BarChart className="h-[12.25rem]" data={strengthData} index="day" categories={["Minutes"]} colors={["violet"]} showLegend={false} showYAxis={false} showGridLines={false} /></MetricCard>
            <MetricCard eyebrow="Audience" title="13,428" delta="+1,388 this month" icon={<Radio className="size-4" />}><div className="flex h-[12.25rem] flex-col justify-end"><SparkAreaChart className="h-28" data={followerData} index="day" categories={["Followers"]} colors={["amber"]} /><div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>30 days ago</span><span className="text-amber">+11.5%</span><span>Today</span></div></div></MetricCard>
          </section>
          <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
            <div className="panel min-h-[390px] p-5 lg:p-6"><div className="flex items-center justify-between gap-3"><div><p className="section-label">Daily systems</p><h2 className="mt-2 font-display text-lg font-medium">Habits</h2></div><Button variant="outline" size="sm" className="border-border bg-secondary/40 text-xs"><ArrowRightLeft /> Habit Swap</Button></div><div className="mt-6 divide-y divide-border">{habits.map((habit) => <label key={habit.id} className="flex cursor-pointer items-center gap-4 py-4"><Checkbox checked={habit.done} onCheckedChange={() => toggleHabit(habit.id)} /><div className="min-w-0 flex-1"><p className={`text-sm transition-colors ${habit.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{habit.label}</p><p className="mt-1 text-[11px] text-muted-foreground">{habit.note}</p></div>{habit.done && <Check className="size-4 text-success" />}</label>)}</div><div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Daily completion</span><span className="font-display text-foreground">{habits.filter((habit) => habit.done).length} / {habits.length}</span></div></div>
            <div className="panel min-h-[390px] p-5 lg:p-6"><div className="flex items-center justify-between"><div><p className="section-label">Time architecture</p><h2 className="mt-2 font-display text-lg font-medium">Today’s schedule</h2></div><CalendarDays className="size-4 text-muted-foreground" /></div><div className="mt-6 space-y-1">{schedule.map((event, index) => <Button key={event.time} variant="ghost" onClick={() => setSelectedEvent(index)} className={`group grid h-auto w-full grid-cols-[3.3rem_1.25rem_1fr_auto] items-center gap-3 rounded-md px-2 py-2.5 text-left font-normal ${selectedEvent === index ? "bg-secondary" : ""}`}><span className="font-mono text-[10px] text-muted-foreground">{event.time}</span><span className={`relative grid size-5 place-items-center rounded-full border bg-background timeline-${event.tone}`}><event.icon className="size-2.5" />{index < schedule.length - 1 && <i className="absolute top-5 h-8 w-px bg-border" />}</span><span className="min-w-0"><span className="block truncate text-sm text-foreground">{event.title}</span><span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{event.meta}</span></span><ChevronRight className={`size-4 transition-transform ${selectedEvent === index ? "translate-x-0 text-foreground" : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} /></Button>)}</div></div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>;
}

function MetricCard({ eyebrow, title, delta, icon, children }: { eyebrow: string; title: string; delta: string; icon: ReactNode; children: ReactNode }) {
  return <article className="panel min-w-0 p-5"><div className="mb-5 flex items-start justify-between"><div><p className="section-label">{eyebrow}</p><div className="mt-2 flex items-baseline gap-2"><h2 className="font-display text-2xl font-semibold">{title}</h2><span className="text-[10px] text-success">{delta}</span></div></div><span className="grid size-8 place-items-center rounded-md border border-border bg-secondary text-muted-foreground">{icon}</span></div>{children}</article>;
}
