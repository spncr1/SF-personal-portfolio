"use client";

import { motion, useReducedMotion } from "motion/react";
import { JamalIdentityMark } from "./JamalIdentityMark";

interface JamalActivationNodeProps {
  open: boolean;
  mobile: boolean;
  processing: boolean;
  unavailable: boolean;
  onActivate: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export function JamalActivationNode({
  open,
  mobile,
  processing,
  unavailable,
  onActivate,
  buttonRef,
}: JamalActivationNodeProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const status = unavailable ? "standby" : processing ? "processing" : "online";

  return (
    <motion.button
      ref={buttonRef}
      className="jamal-activation"
      type="button"
      aria-label={open ? "JAMAL panel is open" : "Open JAMAL assistant"}
      aria-controls="jamal-panel"
      aria-expanded={open}
      data-status={status}
      onClick={onActivate}
      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: open ? 0 : 1, x: open ? 16 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
      tabIndex={open ? -1 : 0}
    >
      <JamalIdentityMark compact bare={!mobile} />
      <span className="jamal-activation__copy">
        <strong>JAMAL</strong>
        <small>{status}</small>
      </span>
    </motion.button>
  );
}
