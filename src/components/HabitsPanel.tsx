import { ArrowRightLeft, Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Habit = { id: number; label: string; note: string; done: boolean };

const initialHabits: Habit[] = [
  { id: 1, label: "Morning sunlight", note: "10 min outside", done: true },
  { id: 2, label: "Deep work block", note: "90 min, phone away", done: true },
  { id: 3, label: "Mobility protocol", note: "Hips + ankles · 15 min", done: false },
  { id: 4, label: "Read & annotate", note: "20 pages", done: false },
];

const swapLibrary = [
  { label: "Box breathing", note: "5 min downregulation" },
  { label: "Zone 1 shakeout", note: "20 min easy spin" },
  { label: "Cold exposure", note: "3 min · post-session" },
  { label: "Daughter walk", note: "Stroller loop · 25 min" },
  { label: "Content capture", note: "1 raw clip filmed" },
  { label: "Stretch + foam roll", note: "Calves + quads · 12 min" },
];

export function HabitsPanel() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  const toggle = (id: number) =>
    setHabits((c) => c.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  const remove = (id: number) => setHabits((c) => c.filter((h) => h.id !== id));

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    const value = label.trim();
    if (!value) return;
    setHabits((c) => [...c, { id: Date.now(), label: value, note: note.trim() || "New system", done: false }]);
    setLabel("");
    setNote("");
  };

  const applySwap = (replacement: { label: string; note: string }) => {
    setHabits((c) =>
      swapTarget === null
        ? [...c, { id: Date.now(), ...replacement, done: false }]
        : c.map((h) => (h.id === swapTarget ? { ...h, ...replacement, done: false } : h)),
    );
    setSwapOpen(false);
    setSwapTarget(null);
  };

  return (
    <div className="panel min-h-[390px] p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-label">Daily systems</p>
          <h2 className="mt-2 font-display text-lg font-medium">Habits</h2>
        </div>
        <Dialog
          open={swapOpen}
          onOpenChange={(open) => {
            setSwapOpen(open);
            if (!open) setSwapTarget(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-border bg-secondary/40 text-xs">
              <ArrowRightLeft /> Habit Swap
            </Button>
          </DialogTrigger>
          <DialogContent className="dark border-border bg-card text-foreground sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {swapTarget === null ? "Add from swap library" : "Swap this habit"}
              </DialogTitle>
              <DialogDescription>
                Pick a replacement system that fits today&apos;s load.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 divide-y divide-border">
              {swapLibrary.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => applySwap(option)}
                  className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-primary"
                >
                  <span>
                    <span className="block text-sm">{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{option.note}</span>
                  </span>
                  <ArrowRightLeft className="size-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 divide-y divide-border">
        {habits.map((habit) => (
          <div key={habit.id} className="group flex items-center gap-4 py-4">
            <Checkbox
              id={`habit-${habit.id}`}
              checked={habit.done}
              onCheckedChange={() => toggle(habit.id)}
            />
            <label htmlFor={`habit-${habit.id}`} className="min-w-0 flex-1 cursor-pointer">
              <p className={`text-sm transition-colors ${habit.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {habit.label}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{habit.note}</p>
            </label>
            {habit.done && <Check className="size-4 text-success" />}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Swap ${habit.label}`}
              className="size-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => {
                setSwapTarget(habit.id);
                setSwapOpen(true);
              }}
            >
              <ArrowRightLeft className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${habit.label}`}
              className="size-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={() => remove(habit.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="New habit"
          className="h-9 border-border bg-secondary/30 text-xs"
        />
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Detail (optional)"
          className="h-9 border-border bg-secondary/30 text-xs sm:max-w-[10rem]"
        />
        <Button type="submit" size="sm" className="h-9 shrink-0 text-xs">
          <Plus /> Add
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Daily completion</span>
        <span className="font-display text-foreground">
          {habits.filter((h) => h.done).length} / {habits.length}
        </span>
      </div>
    </div>
  );
}
