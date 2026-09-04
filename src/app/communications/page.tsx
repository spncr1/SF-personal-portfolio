import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

export const metadata: Metadata = {
  title: "Communications | Spencer Fisher",
};

const channels = [
  {
    id: "email",
    label: "Email",
    value: "spencerflorackfisher@gmail.com",
    href: "mailto:spencerflorackfisher@gmail.com",
    external: false,
  },
  {
    id: "phone",
    label: "Phone",
    value: "0431189783",
    href: "tel:+61431189783",
    external: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "spencer-fisher",
    href: "https://www.linkedin.com/in/spencer-fisher/",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "@spncr1",
    href: "https://github.com/spncr1",
    external: true,
  },
  {
    id: "resume",
    label: "Resume",
    value: "Resume",
    href: "/documents/spencer-fisher-resume.pdf",
    external: true,
  },
] as const;

export default function CommunicationsPage() {
  return (
    <section className="sector sector--communications sector-frame communications-console">
      <div className="sector-frame__masthead communications-console__masthead">
        <div>
          <SystemLabel>Communications</SystemLabel>
          <h1>Contact</h1>
        </div>
      </div>

      <div className="communications-console__grid">
        <HudPanel className="sector-frame__primary communications-console__relay" label="Comms Online" tone="diagnostic">
          <strong>Ready To Connect</strong>
          <p>Get in touch with me via email, phone, LinkedIn, GitHub, or download my resume.</p>
        </HudPanel>

        <div className="communications-console__signal" aria-hidden="true">
          <RadioChatter />
        </div>

        <HudPanel className="communications-console__channels" label="Available comms channels">
          <ul className="communications-console__channel-list">
            {channels.map((channel) => (
              <li key={channel.id}>
                <a
                  className="communications-console__channel"
                  href={channel.href}
                  aria-label={`${channel.label}: ${channel.value}`}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noreferrer" : undefined}
                >
                  <ChannelIcon type={channel.id} />
                  <strong>{channel.value}</strong>
                </a>
              </li>
            ))}
          </ul>
        </HudPanel>
      </div>
    </section>
  );
}

const CHATTER_BAR_HEIGHTS = [
  4, 4, 5, 4, 22, 30, 14, 26, 34, 10, 28, 18, 32, 8, 24, 36, 12, 20, 30, 16, 26, 34, 9, 22, 28, 14, 32, 18, 24, 10, 30,
  20, 26, 15, 34, 12, 28, 22, 8, 24, 32, 16, 30, 18, 26, 14, 20, 6,
];

const CHATTER_BAR_SCALE = 1.5;

function RadioChatter() {
  return (
    <svg
      className="communications-console__signal-svg"
      viewBox="0 0 300 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line className="communications-console__signal-baseline" x1="0" y1="40" x2="300" y2="40" />
      {CHATTER_BAR_HEIGHTS.map((height, index) => {
        const scaledHeight = height * CHATTER_BAR_SCALE;

        return (
          <rect
            key={index}
            className="communications-console__signal-bar"
            x={index * 6.2}
            y={40 - scaledHeight / 2}
            width="3"
            height={scaledHeight}
            rx="1"
            style={{ animationDelay: `${(index % 6) * 120}ms` }}
          />
        );
      })}
    </svg>
  );
}

function ChannelIcon({ type }: { type: (typeof channels)[number]["id"] }) {
  return (
    <svg className="communications-console__channel-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {type === "email" && (
        <>
          <path d="M4.5 7.25h15v9.5h-15z" />
          <path d="m5 8 7 5 7-5" />
        </>
      )}
      {type === "linkedin" && (
        <>
          <path d="M5.5 10v8" />
          <path d="M5.5 6.5v.1" />
          <path d="M10.5 18v-8" />
          <path d="M10.5 13.75c0-2.25 1.45-3.75 3.55-3.75 2.2 0 3.45 1.4 3.45 3.85V18" />
        </>
      )}
      {type === "phone" && (
        <>
          <path d="M7.2 4.75 10 8.2l-1.65 1.65a10.8 10.8 0 0 0 5.8 5.8L15.8 14l3.45 2.8-.55 2.15c-.18.7-.85 1.16-1.56 1.05C10.3 18.95 5.05 13.7 4 6.86c-.11-.71.35-1.38 1.05-1.56z" />
        </>
      )}
      {type === "github" && (
        <>
          <path d="M9 18.5c-3.2 1-3.2-1.55-4.5-2" />
          <path d="M15 21v-3.1c0-.9-.3-1.5-.8-1.8 2.7-.3 5.3-1.3 5.3-5.8 0-1.3-.45-2.3-1.2-3.15.1-.3.5-1.55-.15-3.15 0 0-1-.32-3.15 1.2a10.4 10.4 0 0 0-5.7 0C7.15 3.68 6.15 4 6.15 4c-.65 1.6-.25 2.85-.15 3.15a4.55 4.55 0 0 0-1.2 3.15c0 4.45 2.6 5.5 5.3 5.8-.35.3-.65.85-.75 1.55V21" />
        </>
      )}
      {type === "resume" && (
        <>
          <path d="M7 3.75h7l3 3v13.5H7z" />
          <path d="M14 3.75V7h3" />
          <path d="M9.5 11h5" />
          <path d="M9.5 14h5" />
          <path d="M9.5 17h3" />
        </>
      )}
    </svg>
  );
}
