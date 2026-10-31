import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { contactChannels } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact | Spencer Fisher",
};

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
          <div className="communications-console__relay-status" aria-label="Signal active">
            <span className="communications-console__relay-status-mark" aria-hidden="true" />
            <span className="communications-console__relay-status-dot" aria-hidden="true" />
            <span>Signal active</span>
          </div>

          <div className="communications-console__relay-field">
            <span className="communications-console__relay-rail communications-console__relay-rail--right" aria-hidden="true" />
            <TransmissionRadar />

            <div className="communications-console__relay-copy">
              <strong>Ready to connect</strong>
              <p>
                Get in touch with me via email, phone, LinkedIn, GitHub, or download my resume.
                Open to discussing Software Engineering opportunities, collaborations and interesting projects.
              </p>
            </div>
          </div>

          <div className="communications-console__relay-readout" aria-label="Communications status">
            <div className="communications-console__transmitter" aria-hidden="true">
              <svg viewBox="0 0 96 96" focusable="false">
                <path className="communications-console__transmitter-wave" d="M 37 18 C 28 26 28 38 37 46" />
                <path className="communications-console__transmitter-wave" d="M 29 10 C 15 23 15 41 29 54" />
                <path className="communications-console__transmitter-wave" d="M 59 18 C 68 26 68 38 59 46" />
                <path className="communications-console__transmitter-wave" d="M 67 10 C 81 23 81 41 67 54" />
                <rect x="44" y="14" width="8" height="20" rx="2" />
                <circle cx="48" cy="24" r="2.5" />
                <path d="M 48 34 V 41 M 48 39 L 28 85 H 68 Z M 38 62 H 58 M 33 74 H 63 M 30 85 H 70" />
                <path d="M 42 51 L 55 62 M 54 51 L 39 74 M 42 62 L 59 74 M 37 74 L 51 84 M 59 74 L 45 84" />
              </svg>
            </div>
            <div className="communications-console__transmission-card">
              <span>Transmission status:</span>
              <strong>Available for contact</strong>
            </div>
          </div>
        </HudPanel>

        <div className="communications-console__channels-stack">
          <HudPanel className="communications-console__channels" label="Available comms channels">
            <ul className="communications-console__channel-list">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a
                    className="communications-console__channel"
                    href={channel.href}
                    aria-label={`${channel.label}: ${channel.value}`}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noreferrer" : undefined}
                  >
                    <SiteIcon className="communications-console__channel-icon" name={channel.icon} />
                    <strong>{channel.value}</strong>
                    {channel.external && <SiteIcon className="communications-console__external-icon" name="open-in-new" />}
                  </a>
                </li>
              ))}
            </ul>
          </HudPanel>

          <div className="communications-console__signal" aria-hidden="true">
            <RadioChatter />
          </div>
        </div>
      </div>
    </section>
  );
}

function TransmissionRadar() {
  return (
    <svg
      className="communications-console__relay-radar"
      viewBox="0 0 320 320"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="communications-radar-glow">
          <stop offset="0" stopColor="var(--palette-gold-soft)" stopOpacity="0.14" />
          <stop offset="0.62" stopColor="var(--palette-ember)" stopOpacity="0.035" />
          <stop offset="1" stopColor="var(--palette-ember)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="communications-console__relay-radar-glow" cx="160" cy="160" r="156" />
      <g className="communications-console__relay-radar-grid">
        <circle cx="160" cy="160" r="48" />
        <circle cx="160" cy="160" r="76" />
        <circle cx="160" cy="160" r="104" />
        <circle cx="160" cy="160" r="132" />
        <path d="M 160 16 V 304" />
        <path d="M 58 58 L 262 262 M 262 58 L 58 262" />
      </g>
      <path className="communications-console__relay-radar-arc" d="M 160 28 A 132 132 0 0 1 292 160" />
      <path className="communications-console__relay-radar-arc communications-console__relay-radar-arc--inner" d="M 160 56 A 104 104 0 0 1 264 160" />
      <path className="communications-console__relay-radar-sweep" d="M 160 160 L 264 160 A 104 104 0 0 0 233.54 86.46 Z" />
      <circle className="communications-console__relay-radar-core" cx="160" cy="160" r="3" />
      <circle className="communications-console__relay-radar-contact" cx="238" cy="91" r="3" />
      <path className="communications-console__relay-radar-cross" d="M 267 237 l 9 9 m 0 -9 l -9 9" />
    </svg>
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
