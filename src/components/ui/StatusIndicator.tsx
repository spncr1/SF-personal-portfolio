interface StatusIndicatorProps {
  status: "online" | "offline" | "active" | "idle";
  label?: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  return (
    <span className="status-indicator" data-status={status} aria-label={label ?? status}>
      <span className="status-indicator__dot" aria-hidden="true" />
      <span className="status-indicator__label">{label ?? status}</span>
    </span>
  );
}
