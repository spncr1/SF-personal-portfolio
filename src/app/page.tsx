import type { Metadata } from "next";
import Image from "next/image";
import { GitHubIntel } from "@/components/hub/GitHubIntel";
import { NetworkMap } from "@/components/hub/NetworkMap";
import { SydneyMap } from "@/components/hub/SydneyMap";
import { SydneyClock } from "@/components/hub/SydneyClock";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

export const metadata: Metadata = {
  title: "Central Hub | Spencer Fisher",
};

export default function CentralHubPage() {
  return (
    <section className="central-hub">
      <aside className="central-hub__rail central-hub__rail--left" aria-label="System status">
        <div className="central-hub__status-card">
          <StatusIndicator status="online" label="System online" />
        </div>

        <div className="central-hub__status-stack">
          <SystemLabel variant="metadata">System Status</SystemLabel>
          <dl>
            <div>
              <dt>Network</dt>
              <dd>Stable</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>Online</dd>
            </div>
            <div>
              <dt>Sync</dt>
              <dd>100%</dd>
            </div>
          </dl>
        </div>

        <SydneyClock />

        <div className="central-hub__brand-card" aria-label="Spencer Fisher mark">
          <Image
            src="/brand/spencer-fisher-logo.png"
            alt="Spencer Fisher logo"
            width={180}
            height={180}
            priority
          />
        </div>
      </aside>

      <div className="central-hub__main">
        <div className="central-hub__masthead">
          <SystemLabel>Central Hub</SystemLabel>
        </div>

        <header className="central-hub__intro">
          <h1>WELCOME TO SPENCER FISHER&apos;S DIGITAL CORNER OF THE WORLD</h1>
          <span>Software Engineer • Builder • Problem Solver</span>
        </header>

        <NetworkMap />
      </div>

      <aside className="central-hub__rail central-hub__rail--right" aria-label="System intel">
        <SystemLabel variant="metadata">System Intel</SystemLabel>
        <GitHubIntel />
        <SydneyMap />
      </aside>

      <div className="central-hub__bottom-bar" aria-hidden="true">
        <span>SYS-2099</span>
        <span>SF Operations System v2.0</span>
        <span>© 2026 Spencer Fisher Interface</span>
      </div>
    </section>
  );
}
