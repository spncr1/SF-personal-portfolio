"use client";

import { useEffect, useState } from "react";

interface ClockState {
  time: string;
  date: string;
  zone: string;
}

const timeZone = "Australia/Sydney";

function readSydneyClock(): ClockState {
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
    timeZoneName: "short",
  });
  const dateFormatter = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone,
  });

  const timeParts = timeFormatter.formatToParts(now);
  const zone = timeParts.find((part) => part.type === "timeZoneName")?.value ?? "AEST";
  const time = timeParts
    .filter((part) => part.type !== "timeZoneName")
    .map((part) => part.value)
    .join("")
    .trim();

  return {
    time,
    date: dateFormatter.format(now),
    zone,
  };
}

export function SydneyClock() {
  const [clock, setClock] = useState<ClockState>({
    time: "--:--:--",
    date: "Syncing",
    zone: "AEST",
  });

  useEffect(() => {
    const syncClock = () => setClock(readSydneyClock());
    const initialSync = window.setTimeout(syncClock, 0);
    const timer = window.setInterval(syncClock, 1000);

    return () => {
      window.clearTimeout(initialSync);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="central-hub__clock-card">
      <span>Sydney, Australia</span>
      <strong>{clock.time}</strong>
      <dl>
        <div>
          <dt>Date</dt>
          <dd>{clock.date}</dd>
        </div>
        <div>
          <dt>Zone</dt>
          <dd>{clock.zone}</dd>
        </div>
      </dl>
    </div>
  );
}
