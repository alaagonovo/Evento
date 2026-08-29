"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { type Dictionary } from "@/shared/lib/i18n";
import type { DressAngle } from "../data/mock";

type DressOptionsProps = {
  sizes: string[];
  dictionary: Dictionary;
  onAngleChange?: (angle: DressAngle | "all") => void;
};

const ANGLES: DressAngle[] = ["front", "back", "side", "detail"];

export function DressOptions({ sizes, dictionary, onAngleChange }: DressOptionsProps) {
  const [size, setSize] = useState<string | null>(null);
  const [angle, setAngle] = useState<DressAngle | "all">("all");

  function selectAngle(next: DressAngle | "all") {
    setAngle(next);
    onAngleChange?.(next);
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-soft">
      <div>
        <p className="mb-3 text-sm font-medium">{dictionary.vendor.gallery}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={angle === "all" ? "default" : "outline"}
            onClick={() => selectAngle("all")}
          >
            {dictionary.vendor.gallery}
          </Button>
          {ANGLES.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={angle === item ? "default" : "outline"}
              onClick={() => selectAngle(item)}
            >
              {dictionary.vendor.angles[item]}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">{dictionary.vendor.sizes}</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSize(item)}
              className={cn(
                "flex size-11 items-center justify-center rounded-xl border text-sm transition",
                size === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/40",
              )}
              aria-pressed={size === item}
            >
              {item}
            </button>
          ))}
        </div>
        {!size ? (
          <p className="mt-2 text-xs text-muted-foreground">{dictionary.vendor.selectSize}</p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">{dictionary.vendor.fittingDate}</span>
          <Input type="date" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">{dictionary.vendor.pickupDate}</span>
          <Input type="date" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">{dictionary.vendor.returnDate}</span>
          <Input type="date" />
        </label>
      </div>
    </div>
  );
}
