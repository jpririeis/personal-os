import { Instagram, Facebook, Youtube, Music2, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { name: "Instagram", icon: Instagram, followers: 100, handle: "Reels · daily" },
  { name: "TikTok", icon: Music2, followers: 100, handle: "3–5 posts/week" },
  { name: "YouTube", icon: Youtube, followers: 100, handle: "Shorts · daily" },
  { name: "Facebook", icon: Facebook, followers: 100, handle: "Reels cross-post" },
];

type Card = { id: number; title: string; meta: string };
const initialBoard: { key: string; title: string; cards: Card[] }[] = [
  {
    key: "ideas",
    title: "Ideas",
    cards: [
      { id: 1, title: "Dad Hours: 5 AM Morning Routine & Workout", meta: "Hook: dark kitchen, bottle + bike shoes" },
      { id: 2, title: "Industry Myths vs. Facts (What's actually worth your money)", meta: "Series · supplements first" },
      { id: 3, title: "Lessons I want to teach my daughter from Day 1", meta: "Emotional · high save rate" },
    ],
  },
  { key: "filming", title: "Filming", cards: [] },
  { key: "editing", title: "Editing", cards: [] },
  { key: "posted", title: "Posted", cards: [] },
];

const deals = [
  { brand: "UTAHRun", gear: "Race kit + singlet", status: "Researching", follow: "Aug 12" },
  { brand: "Nutricost", gear: "Bulk malto / electrolytes", status: "Pitch sent", follow: "Aug 10" },
  { brand: "VASA", gear: "Gym membership comp", status: "Researching", follow: "Aug 14" },
  { brand: "Clean Simple Eats", gear: "Protein + affiliate code", status: "Pitch sent", follow: "Aug 11" },
  { brand: "iFIT", gear: "Trainer subscription", status: "Not started", follow: "Aug 18" },
  { brand: "Bucked Up", gear: "Pre-workout seeding", status: "Not started", follow: "Aug 19" },
  { brand: "Dadgang", gear: "Dad hat / apparel", status: "Warm DM", follow: "Aug 9" },
  { brand: "Rockbros", gear: "Cycling accessories", status: "Not started", follow: "Aug 20" },
];

const statusTone: Record<string, string> = {
  "Not started": "text-muted-foreground",
  Researching: "text-amber",
  "Warm DM": "text-swim",
  "Pitch sent": "text-run",
};

export function CreatorStudio() {
  const [board, setBoard] = useState(initialBoard);

  const move = (columnIndex: number, cardId: number, direction: 1 | -1) => {
    const target = columnIndex + direction;
    if (target < 0 || target >= board.length) return;
    setBoard((current) => {
      const card = current[columnIndex]!.cards.find((c) => c.id === cardId);
      if (!card) return current;
      return current.map((column, index) => {
        if (index === columnIndex) return { ...column, cards: column.cards.filter((c) => c.id !== cardId) };
        if (index === target) return { ...column, cards: [...column.cards, card] };
        return column;
      });
    });
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {platforms.map((platform) => (
          <article key={platform.name} className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="section-label">{platform.name}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{platform.followers.toLocaleString()}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{platform.handle}</p>
              </div>
              <span className="grid size-8 place-items-center rounded-md border border-border bg-secondary text-muted-foreground">
                <platform.icon className="size-4" />
              </span>
            </div>
            <p className="mt-4 border-t border-border pt-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Baseline · start of build
            </p>
          </article>
        ))}
      </section>

      <section className="panel p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Content pipeline</p>
            <h2 className="mt-2 font-display text-lg font-medium">Short-form Kanban</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">TikTok · Reels · Shorts</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {board.map((column, columnIndex) => (
            <div key={column.key} className="rounded-md border border-border bg-secondary/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{column.title}</p>
                <span className="font-mono text-[10px] text-muted-foreground">{column.cards.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {column.cards.map((card) => (
                  <div key={card.id} className="rounded-md border border-border bg-card p-3">
                    <p className="text-sm leading-snug text-foreground">{card.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{card.meta}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => move(columnIndex, card.id, -1)}
                        disabled={columnIndex === 0}
                        className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => move(columnIndex, card.id, 1)}
                        disabled={columnIndex === board.length - 1}
                        className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        Advance
                      </button>
                    </div>
                  </div>
                ))}
                {column.cards.length === 0 && (
                  <p className="flex items-center gap-1.5 py-4 text-[11px] text-muted-foreground">
                    <Plus className="size-3" /> Empty
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Monetization</p>
            <h2 className="mt-2 font-display text-lg font-medium">Brand deal CRM</h2>
          </div>
          <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
            {deals.length} targets
          </Badge>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="border-b border-border pb-3 pr-4">Brand</th>
                <th className="border-b border-border pb-3 pr-4">Target gear / comp</th>
                <th className="border-b border-border pb-3 pr-4">Pitch status</th>
                <th className="border-b border-border pb-3">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.brand}>
                  <td className="border-b border-border py-3 pr-4 text-sm text-foreground">{deal.brand}</td>
                  <td className="border-b border-border py-3 pr-4 text-[11px] text-muted-foreground">{deal.gear}</td>
                  <td className={`border-b border-border py-3 pr-4 text-[11px] ${statusTone[deal.status] ?? "text-muted-foreground"}`}>
                    {deal.status}
                  </td>
                  <td className="border-b border-border py-3 font-mono text-[11px] text-muted-foreground">{deal.follow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
