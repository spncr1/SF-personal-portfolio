import { contactChannels } from "@/data/contact";
import type {
  JamalContactActionId,
  JamalLink,
  JamalLinkIcon,
  JamalLinkId,
  JamalRouteId,
} from "@/types/jamal";

export interface JamalPageContext {
  routeId: JamalRouteId;
  pathname: string;
  label: string;
  description: string;
}

interface JamalRouteDefinition extends JamalLink {
  id: JamalRouteId;
  description: string;
}

export const JAMAL_ROUTES: readonly JamalRouteDefinition[] = [
  {
    id: "hub",
    label: "Central Hub",
    href: "/",
    kind: "internal",
    icon: "hub",
    description: "The portfolio overview and navigation network.",
  },
  {
    id: "operations",
    label: "Active Operations",
    href: "/operations",
    kind: "internal",
    icon: "operations",
    description: "Spencer's current builds and engineering focus.",
  },
  {
    id: "capabilities",
    label: "Skills",
    href: "/capabilities",
    kind: "internal",
    icon: "capabilities",
    description: "Spencer's published technical capabilities and tools.",
  },
  {
    id: "communications",
    label: "Contact",
    href: "/communications",
    kind: "internal",
    icon: "communications",
    description: "The portfolio's published contact and resume channels.",
  },
  {
    id: "personnel",
    label: "Personnel File",
    href: "/personnel",
    kind: "internal",
    icon: "personnel",
    description: "Spencer's published profile, experience, education, and interests.",
  },
  {
    id: "projects",
    label: "Project Systems",
    href: "/projects",
    kind: "internal",
    icon: "projects",
    description: "The index of Spencer's published software projects.",
  },
  {
    id: "project-nexa",
    label: "Nexa Project",
    href: "/projects/nexa",
    kind: "internal",
    icon: "projects",
    description: "The detailed project record for Nexa.",
  },
  {
    id: "project-atmos-fc",
    label: "Atmos FC Project",
    href: "/projects/atmos-fc",
    kind: "internal",
    icon: "projects",
    description: "The detailed project record for Atmos FC.",
  },
] as const;

interface JamalContactActionDefinition extends JamalLink {
  id: JamalContactActionId;
  description: string;
}

const contactById = new Map(contactChannels.map((channel) => [channel.id, channel]));

export const JAMAL_CONTACT_ACTIONS: readonly JamalContactActionDefinition[] = [
  createContactAction("contact-email", "email", "Compose an email to Spencer.", "email"),
  createContactAction("contact-phone", "phone", "Call Spencer's published phone number.", "phone"),
  createContactAction("contact-linkedin", "linkedin", "Open Spencer's LinkedIn profile.", "external"),
  createContactAction("contact-github", "github", "Open Spencer's GitHub profile.", "external"),
  createContactAction("contact-resume", "resume", "Open Spencer's published resume.", "document"),
] as const;

function createContactAction(
  id: JamalContactActionId,
  channelId: (typeof contactChannels)[number]["id"],
  description: string,
  kind: JamalContactActionDefinition["kind"],
): JamalContactActionDefinition {
  const channel = contactById.get(channelId);
  if (!channel) throw new Error(`Missing contact channel: ${channelId}`);

  return {
    id,
    label: channel.label,
    href: channel.href,
    kind,
    icon: channel.icon as JamalLinkIcon,
    description,
  };
}

const routeById = new Map(JAMAL_ROUTES.map((route) => [route.id, route]));
const routeByPath = new Map(JAMAL_ROUTES.map((route) => [route.href, route]));
const linkById = new Map<JamalLinkId, JamalLink>(
  [...JAMAL_ROUTES, ...JAMAL_CONTACT_ACTIONS].map((link) => [link.id, link]),
);

export function normaliseJamalPathname(value: string): string {
  const pathname = value.trim().split(/[?#]/, 1)[0] || "/";
  if (!pathname.startsWith("/") || pathname.length > 160) return "/";
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function resolveJamalPageContext(value: string): JamalPageContext {
  const pathname = normaliseJamalPathname(value);
  const exactRoute = routeByPath.get(pathname);
  const projectRoute = pathname.startsWith("/projects/") ? routeById.get("projects") : undefined;
  const route = exactRoute ?? projectRoute ?? routeById.get("hub") ?? JAMAL_ROUTES[0];

  return {
    routeId: route.id,
    pathname,
    label: route.label,
    description: route.description,
  };
}

export function mapJamalLinkIdsToLinks(linkIds: readonly string[]): JamalLink[] {
  const links: JamalLink[] = [];
  const seen = new Set<JamalLinkId>();

  for (const linkId of linkIds) {
    const link = linkById.get(linkId as JamalLinkId);
    if (!link || seen.has(linkId as JamalLinkId)) continue;

    seen.add(linkId as JamalLinkId);
    links.push({ label: link.label, href: link.href, kind: link.kind, icon: link.icon });
    if (links.length === 2) break;
  }

  return links;
}

export function getJamalSuggestedQuestions(pathname: string): string[] {
  const { routeId } = resolveJamalPageContext(pathname);

  switch (routeId) {
    case "capabilities":
      return ["What are Spencer's strongest backend skills?", "Which projects use PostgreSQL?"];
    case "operations":
      return ["What is Spencer currently building?", "What is the focus of Atmos FC?"];
    case "personnel":
      return ["Tell me about Spencer's background.", "What are Spencer's interests?"];
    case "project-nexa":
      return ["What problem does Nexa solve?", "How is Nexa built?"];
    case "project-atmos-fc":
      return ["What does Atmos FC analyse?", "How is Atmos FC built?"];
    case "projects":
      return ["Compare Nexa and Atmos FC.", "Which project uses FastAPI?"];
    case "communications":
      return ["How can I contact Spencer?", "Where can I view Spencer's resume?"];
    default:
      return ["What can I explore here?", "Tell me about Spencer's projects."];
  }
}
