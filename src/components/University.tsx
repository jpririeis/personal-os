import { CalendarClock, CalendarRange, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Item = { id: number; course: string; title: string; due: string; type: string; done: boolean };

const thisWeek: Item[] = [
  { id: 1, course: "Behavioral Economics", title: "Problem Set 4", due: "Thu, Aug 6 · 11:59 PM", type: "Assignment", done: false },
  { id: 2, course: "Financial Accounting", title: "Chapter 7 quiz", due: "Fri, Aug 7 · 8:00 AM", type: "Quiz", done: false },
  { id: 3, course: "Statistics II", title: "Lab report: regression", due: "Sat, Aug 8 · 11:59 PM", type: "Lab", done: false },
  { id: 4, course: "Business Writing", title: "Peer review x2", due: "Sun, Aug 9 · 11:59 PM", type: "Discussion", done: true },
];

const nextWeek: Item[] = [
  { id: 5, course: "Behavioral Economics", title: "Midterm exam", due: "Tue, Aug 11 · 10:00 AM", type: "Exam", done: false },
  { id: 6, course: "Financial Accounting", title: "Case study draft", due: "Wed, Aug 12 · 11:59 PM", type: "Assignment", done: false },
  { id: 7, course: "Statistics II", title: "Problem Set 5", due: "Thu, Aug 13 · 11:59 PM", type: "Assignment", done: false },
  { id: 8, course: "Business Writing", title: "Final pitch outline", due: "Sun, Aug 16 · 11:59 PM", type: "Project", done: false },
];

function Section({
  label,
  title,
  icon,
  items,
}: {
  label: string;
  title: string;
  icon: React.ReactNode;
  items: Item[];
}) {
  const [state, setState] = useState(items);
  const toggle = (id: number) => setState((c) => c.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  return (
    <div className="panel p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">{label}</p>
          <h2 className="mt-2 font-display text-lg font-medium">{title}</h2>
        </div>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-5 divide-y divide-border">
        {state.map((item) => (
          <div key={item.id} className="flex items-start gap-4 py-4">
            <Checkbox id={`task-${item.id}`} checked={item.done} onCheckedChange={() => toggle(item.id)} />
            <label htmlFor={`task-${item.id}`} className="min-w-0 flex-1 cursor-pointer">
              <p className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {item.title}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {item.course} · {item.type}
              </p>
            </label>
            <p className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{item.due}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
        <span className="text-muted-foreground">Completed</span>
        <span className="font-display text-foreground">
          {state.filter((i) => i.done).length} / {state.length}
        </span>
      </div>
    </div>
  );
}

export function University() {
  return (
    <div className="space-y-4">
      <section className="panel flex flex-wrap items-center justify-between gap-4 p-5 lg:p-6">
        <div>
          <p className="section-label">University</p>
          <h2 className="mt-2 font-display text-lg font-medium">Deadline tracker</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">Summer term · 4 active courses</p>
        </div>
        <GraduationCap className="size-5 text-muted-foreground" />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Section label="Due now" title="Coming up this week" icon={<CalendarClock className="size-4" />} items={thisWeek} />
        <Section label="Plan ahead" title="Look ahead" icon={<CalendarRange className="size-4" />} items={nextWeek} />
      </section>
    </div>
  );
}
