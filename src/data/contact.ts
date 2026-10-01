export type ContactChannelId = "email" | "phone" | "linkedin" | "github" | "resume";

export interface ContactChannel {
  id: ContactChannelId;
  label: string;
  value: string;
  href: string;
  external: boolean;
  icon: "mail" | "call" | "linkedin" | "github" | "description";
}

export const contactChannels = [
  {
    id: "email",
    label: "Email",
    value: "spencerflorackfisher@gmail.com",
    href: "mailto:spencerflorackfisher@gmail.com",
    external: false,
    icon: "mail",
  },
  {
    id: "phone",
    label: "Phone",
    value: "0431189783",
    href: "tel:+61431189783",
    external: false,
    icon: "call",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "spencer-fisher",
    href: "https://www.linkedin.com/in/spencer-fisher/",
    external: true,
    icon: "linkedin",
  },
  {
    id: "github",
    label: "GitHub",
    value: "@spncr1",
    href: "https://github.com/spncr1",
    external: true,
    icon: "github",
  },
  {
    id: "resume",
    label: "Resume",
    value: "Resume",
    href: "/documents/spencer-fisher-resume.pdf",
    external: true,
    icon: "description",
  },
] as const satisfies readonly ContactChannel[];
