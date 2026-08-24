"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface SectorTransitionProps {
  children: ReactNode;
  sectorId: string;
  routeKey: string;
}

export function SectorTransition({ children, sectorId, routeKey }: SectorTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      className="sector-transition"
      data-sector={sectorId}
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="sector-transition__scan" aria-hidden="true">
        <span>Identify</span>
        <span>Structure</span>
        <span>Content</span>
      </div>
      {children}
    </motion.div>
  );
}
