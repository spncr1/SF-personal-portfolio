import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

export default function CommunicationsPage() {
  return (
    <section className="sector sector--communications sector-frame">
      <div className="sector-frame__masthead">
        <div>
          <SystemLabel>Communications</SystemLabel>
          <h1>Contact Relay</h1>
        </div>
        <span>SEC-05 / Pending</span>
      </div>

      <div className="sector-frame__grid">
        <HudPanel className="sector-frame__primary" label="Relay state" tone="diagnostic">
          <strong>Standby</strong>
          <p>Email, LinkedIn, GitHub, and resume controls are reserved for the communications pass.</p>
        </HudPanel>

        <HudPanel label="Available channels">
          <ul className="sector-frame__list">
            <li>Email</li>
            <li>LinkedIn</li>
            <li>GitHub</li>
            <li>Resume</li>
          </ul>
        </HudPanel>

        <HudPanel label="Privacy lock" tone="accent">
          <p>Phone details remain outside public data modules.</p>
        </HudPanel>
      </div>
    </section>
  );
}
