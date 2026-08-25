import type { ReactNode } from "react";

interface SystemLabelProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "metadata";
}

export function SystemLabel({ children, variant = "primary" }: SystemLabelProps) {
  return (
    <span className="system-label" data-variant={variant}>
      {children}
    </span>
  );
}