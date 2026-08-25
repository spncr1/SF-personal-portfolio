import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Personnel | Spencer Fisher",
};

export default function PersonnelPage() {
  return (
    <section className="sector sector--personnel sector-frame">
      <div className="sector-frame__masthead">
        <div>
          <SystemLabel>Personnel</SystemLabel>
          <h1>Personnel Record</h1>
        </div>
        <span>SEC-03 / Pending</span>
      </div>

      <div className="sector-frame__grid">
        <HudPanel className="sector-frame__primary" label="Identity record" tone="accent">
          <strong>{profile.name}</strong>
          <p>{profile.title}</p>
        </HudPanel>

        <HudPanel label="Module state" tone="diagnostic">
          <p>Profile, portrait, education, experience, and interests layout pending implementation.</p>
        </HudPanel>

        <HudPanel label="Available fields">
          <ul className="sector-frame__list">
            <li>Education</li>
            <li>Experience</li>
            <li>Career direction</li>
          </ul>
        </HudPanel>
      </div>
    </section>
  );
}
