import type { PersonalInterestIcon as PersonalInterestIconName } from "@/data/profile";

interface PersonalInterestIconProps {
  icon: PersonalInterestIconName;
}

export function PersonalInterestIcon({ icon }: PersonalInterestIconProps) {
  if (icon === "football") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8.25" />
        <path d="m9.6 9.1 2.4-1.7 2.4 1.7-.9 2.8h-3zM12 7.4V4m-2.4 5.1-3.2-1m4.1 3.8-2 2.8m5-2.8 2 2.8m-1.1-5.6 3.2-1M8.5 14.7l-2.2 1.5m9.2-1.5 2.2 1.5M10.5 18l1.5 2.25L13.5 18" />
      </svg>
    );
  }

  if (icon === "gym") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 8v8M4.5 9.5v5M17 8v8m2.5-6.5v5M2.5 12h19M7 10.25h10v3.5H7z" />
      </svg>
    );
  }

  if (icon === "music") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.5 17.25V6.5l8-1.75v10.5M9.5 9l8-1.75" />
        <ellipse cx="7" cy="17.5" rx="2.5" ry="1.75" />
        <ellipse cx="15" cy="15.5" rx="2.5" ry="1.75" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 16.5 1.1-4.1L15.6 3l3.4 3.4-9.4 9.5L5 16.5Zm9-11.9 3.4 3.4M6.1 12.4l3.5 3.5M4.25 19.5h15.5" />
    </svg>
  );
}
