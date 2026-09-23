"use client";

import { motion, useReducedMotion } from "motion/react";

import { hexPoints } from "@/lib/networkGeometry";

export type RecordRevealMode = "open" | "closed";

interface RecordRevealEmblemProps {
  mode: RecordRevealMode;
  className?: string;
  ariaLabel?: string;
  showNode?: boolean;
}

export function RecordRevealEmblem({
  mode,
  className,
  ariaLabel,
  showNode = true,
}: RecordRevealEmblemProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const ringLength = mode === "open" ? 0.56 : 1;
  const classes = ["record-reveal-emblem", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      data-mode={mode}
      viewBox="0 0 100 100"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <g className="record-reveal-emblem__dial">
        <circle className="record-reveal-emblem__guide" cx="50" cy="50" r="39" />
        <circle className="record-reveal-emblem__guide record-reveal-emblem__guide--inner" cx="50" cy="50" r="33.5" />

        <motion.circle
          className="record-reveal-emblem__ring"
          cx="50"
          cy="50"
          r="39"
          pathLength="1"
          transform="rotate(-118 50 50)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: ringLength, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { pathLength: { duration: mode === "open" ? 0.7 : 0.9, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.16 } }
          }
        />
      </g>

      <motion.g
        className="record-reveal-emblem__core"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <polygon className="record-reveal-emblem__hex record-reveal-emblem__hex--outer" points={hexPoints(50, 50, 18)} />
        <polygon className="record-reveal-emblem__hex record-reveal-emblem__hex--inner" points={hexPoints(50, 50, 10.5)} />
        {showNode && <circle className="record-reveal-emblem__node" cx="50" cy="50" r="2.4" />}
      </motion.g>
    </svg>
  );
}
