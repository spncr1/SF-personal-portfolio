import { NetworkMap } from "@/components/hub/NetworkMap";
import { SystemLabel } from "@/components/ui/SystemLabel";

export default function CentralHubPage() {
  return (
    <section className="central-hub">
      <div className="central-hub__masthead">
        <SystemLabel>Central Hub</SystemLabel>
        <span className="central-hub__status">Network ready</span>
      </div>
      <NetworkMap />
    </section>
  );
}
