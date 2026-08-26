"use client";

import { useEffect, useMemo, useState } from "react";

interface CountUpValueProps {
  value: number;
  durationMs?: number;
  delayMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUpValue({
  value,
  durationMs = 820,
  delayMs = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpValueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [complete, setComplete] = useState(false);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-AU", {
        maximumFractionDigits: 0,
      }),
    [],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let startedAt = 0;
    const timeout = window.setTimeout(() => {
      if (prefersReducedMotion || durationMs <= 0) {
        setDisplayValue(value);
        setComplete(true);
        return;
      }

      setComplete(false);
      setDisplayValue(0);
      startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
          return;
        }

        setDisplayValue(value);
        setComplete(true);
      };

      frame = window.requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [delayMs, durationMs, value]);

  return (
    <span className={className ?? "system-count"} data-count-complete={complete}>
      {prefix}
      {formatter.format(displayValue)}
      {suffix}
    </span>
  );
}
