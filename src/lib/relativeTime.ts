const relativeTimeUnits: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-AU", { numeric: "auto" });

export function formatRelativeTime(value: string | null, fallback = "No pushes") {
  if (!value) return fallback;

  const timestamp = new Date(value).getTime();
  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);

  for (const [unit, seconds] of relativeTimeUnits) {
    const amount = Math.trunc(diffSeconds / seconds);
    if (Math.abs(amount) >= 1) return relativeTimeFormatter.format(amount, unit);
  }

  return "Just now";
}
