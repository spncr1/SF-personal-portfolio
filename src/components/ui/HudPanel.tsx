import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SystemLabel } from "./SystemLabel";

interface HudPanelProps {
  children: ReactNode;
  className?: string;
  label?: string;
  tone?: "default" | "accent" | "diagnostic";
}

export function HudPanel({ children, className, label, tone = "default" }: HudPanelProps) {
  return (
    <section className={cn("hud-panel", className)} data-tone={tone}>
      {label && (
        <header className="hud-panel__header">
          <SystemLabel variant="primary">{label}</SystemLabel>
        </header>
      )}
      {children}
    </section>
  );
}
