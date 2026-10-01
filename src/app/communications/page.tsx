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
          <div className="communications-console__relay-copy">
            <strong>Ready To Connect</strong>
            <p>Get in touch with me via email, phone, LinkedIn, GitHub, or download my resume.</p>
          </div>
          <dl className="communications-console__relay-readout" aria-label="Communications status">
            <div>
              <dt>Signal</dt>
              <dd>Online</dd>
            </div>
            <div>
              <dt>Channels</dt>
              <dd>{String(contactChannels.length).padStart(2, "0")} available</dd>
            </div>
            <div>
              <dt>Route</dt>
              <dd>Direct</dd>
            </div>
          </dl>
        </HudPanel>

        <div className="communications-console__signal" aria-hidden="true">
          <RadioChatter />
        </div>

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
