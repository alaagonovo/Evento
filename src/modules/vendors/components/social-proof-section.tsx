"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck, CalendarDays, MapPin, Star } from "lucide-react";
import { Container } from "@/shared/components/container";

type StatItem = {
  value: string;
  label: string;
};

type SocialProofSectionProps = {
  imageSrc: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  stats: StatItem[];
};

const STAT_ICONS = [CalendarDays, Star, BadgeCheck, MapPin] as const;
const COUNT_MS = 1600;
const STAGGER_MS = 140;

type ParsedStat = {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
};

function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([^\d.]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, suffix: value, decimals: 0 };
  }

  const [, prefix, raw, suffix] = match;
  const decimals = raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0;
  return {
    prefix,
    target: Number(raw.replace(/,/g, "")),
    suffix,
    decimals,
  };
}

function formatStat(amount: number, parsed: ParsedStat) {
  const numeric =
    parsed.decimals > 0
      ? amount.toFixed(parsed.decimals)
      : Math.round(amount).toLocaleString("en-US");
  return `${parsed.prefix}${numeric}${parsed.suffix}`;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function CountUpStat({ value, active, delayMs }: { value: string; active: boolean; delayMs: number }) {
  const parsed = parseStatValue(value);
  const [display, setDisplay] = useState(() => formatStat(0, parsed));

  useEffect(() => {
    if (!active) return;

    const next = parseStatValue(value);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(formatStat(next.target, next));
      return;
    }

    let frame = 0;
    let start = 0;
    const delay = window.setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / COUNT_MS, 1);
        setDisplay(formatStat(next.target * easeOutCubic(progress), next));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [active, delayMs, value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{display}</span>
    </>
  );
}

export function SocialProofSection({
  imageSrc,
  eyebrow,
  heading,
  subtitle,
  stats,
}: SocialProofSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-secondary py-20 text-secondary-foreground sm:py-24"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary/55" />
      <Container className="relative">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-gold">{eyebrow}</p>
          <h2 className="font-heading mt-3 text-3xl sm:text-4xl lg:text-5xl">{heading}</h2>
          <div className="mt-4 h-px w-16 bg-gold" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary-foreground/75 sm:text-lg">
            {subtitle}
          </p>
        </div>
        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = STAT_ICONS[index] ?? CalendarDays;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Icon className="size-5" aria-hidden />
                </div>
                <dd className="font-heading text-4xl tabular-nums text-gold sm:text-5xl">
                  <CountUpStat value={stat.value} active={active} delayMs={index * STAGGER_MS} />
                </dd>
                <dt className="mt-2 text-sm leading-snug text-secondary-foreground/70">{stat.label}</dt>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
