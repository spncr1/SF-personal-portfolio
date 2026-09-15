import { SiteIcon, type SiteIconName } from "@/components/ui/SiteIcon";

const technologyIcons: Record<string, SiteIconName> = {
  "C#": "dotnet",
  "C++": "cplusplus",
  "Chart.js": "javascript",
  Confluence: "confluence",
  CSS: "css",
  EJS: "javascript",
  Express: "express",
  FastAPI: "fastapi",
  Git: "git",
  GitHub: "github",
  HTML: "html5",
  Java: "java",
  JavaScript: "javascript",
  MongoDB: "mongodb",
  "Neon PostgreSQL": "postgresql",
  "Node.js": "nodedotjs",
  Nodemailer: "mail",
  Passport: "code",
  PostgreSQL: "postgresql",
  Python: "python",
  REST: "api",
  SQL: "database",
  SQLite: "sqlite",
  VADER: "python",
  "Vanilla JavaScript": "javascript",
  Vercel: "vercel",
};

export function TechnologyBadge({ technology }: { technology: string }) {
  const icon = technologyIcons[technology] ?? "code";

  return (
    <span className="capabilities-matrix__tech">
      <SiteIcon className="capabilities-matrix__tech-icon" name={icon} />
      {technology}
    </span>
  );
}
