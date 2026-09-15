import type { CSSProperties } from "react";

const iconFiles = {
  api: "api.svg",
  call: "call.svg",
  c: "c.svg",
  "chevron-right": "chevron-right.svg",
  close: "close.svg",
  code: "code.svg",
  confluence: "confluence.svg",
  cplusplus: "cplusplus.svg",
  css: "css.svg",
  database: "database.svg",
  description: "description.svg",
  dotnet: "dotnet.svg",
  draw: "draw.svg",
  express: "express.svg",
  fastapi: "fastapi.svg",
  fitness: "fitness.svg",
  git: "git.svg",
  github: "github.svg",
  html5: "html5.svg",
  javascript: "javascript.svg",
  java: "java.svg",
  language: "language.svg",
  linkedin: "linkedin.svg",
  mail: "mail.svg",
  mongodb: "mongodb.svg",
  "music-note": "music-note.svg",
  nodedotjs: "nodedotjs.svg",
  "open-in-new": "open-in-new.svg",
  postgresql: "postgresql.svg",
  python: "python.svg",
  school: "school.svg",
  "screenshot-monitor": "screenshot-monitor.svg",
  sqlite: "sqlite.svg",
  soccer: "soccer.svg",
  vercel: "vercel.svg",
} as const;

export type SiteIconName = keyof typeof iconFiles;

interface SiteIconProps {
  className?: string;
  name: SiteIconName;
}

export function SiteIcon({ className, name }: SiteIconProps) {
  const classes = ["site-icon", className].filter(Boolean).join(" ");
  const style = {
    "--site-icon-source": `url("/icons/ui/${iconFiles[name]}")`,
  } as CSSProperties;

  return <span className={classes} style={style} aria-hidden="true" />;
}
