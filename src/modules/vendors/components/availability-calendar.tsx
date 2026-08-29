"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";

const WEEKDAY_KEYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;

type AvailabilityCalendarProps = {
  bookedDates: string[];
  locale: Locale;
  dictionary: Dictionary;
};

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AvailabilityCalendar({
  bookedDates,
  locale,
  dictionary,
}: AvailabilityCalendarProps) {
  const booked = useMemo(() => new Set(bookedDates), [bookedDates]);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 1) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; key: string; booked: boolean; past: boolean }> = [];
    const todayKey = toKey(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    );

    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ day: null, key: `empty-${i}`, booked: false, past: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = toKey(year, month, day);
      cells.push({
        day,
        key,
        booked: booked.has(key),
        past: key < todayKey,
      });
    }

    return cells;
  }, [booked, month, year]);

  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg">{dictionary.vendor.availability}</h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label={dictionary.vendor.prevPhoto}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Button>
          <span className="min-w-32 text-center text-sm font-medium">{monthLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label={dictionary.vendor.nextPhoto}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_KEYS.map((key) => (
          <span key={key} className="py-1">
            {dictionary.vendor.weekdays[key]}
          </span>
        ))}
        {days.map((cell) => {
          if (!cell.day) {
            return <span key={cell.key} />;
          }

          const isSelected = selected === cell.key;
          const disabled = cell.booked || cell.past;

          return (
            <button
              key={cell.key}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(cell.key)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-full text-sm transition",
                disabled && "cursor-not-allowed text-muted-foreground/40 line-through",
                cell.booked && "bg-muted text-muted-foreground/70",
                !disabled && "hover:bg-primary/10",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
              )}
              aria-pressed={isSelected}
              aria-label={`${cell.day}, ${cell.booked ? dictionary.vendor.booked : dictionary.vendor.available}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" />
          {dictionary.vendor.selected}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-muted" />
          {dictionary.vendor.booked}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-border" />
          {dictionary.vendor.available}
        </span>
      </div>
    </div>
  );
}
