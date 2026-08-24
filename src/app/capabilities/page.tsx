import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

export default function CapabilitiesPage() {
  return (
    <section className="sector sector--capabilities sector-frame">
      <div className="sector-frame__masthead">
        <div>
          <SystemLabel>Capabilities</SystemLabel>
          <h1>Capability Matrix</h1>
        </div>
        <span>SEC-02 / Pending</span>
      </div>

      <div className="sector-frame__grid">
        <HudPanel className="sector-frame__primary" label="Module state" tone="diagnostic">
          <strong>Offline</strong>
          <p>Capability relationships are reserved for a later implementation pass.</p>
        </HudPanel>

        <HudPanel label="Reserved signals">
          <ul className="sector-frame__list">
            <li>Technology nodes</li>
            <li>Project relationships</li>
            <li>Applied domains</li>
          </ul>
        </HudPanel>

        <HudPanel label="Data source" tone="accent">
          <p>Project and skill data modules are available for this sector when implementation begins.</p>
        </HudPanel>
      </div>
    </section>
  );
}
