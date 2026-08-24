"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatSectorCoordinates, getSectorFromPathname, sectorCodes } from "@/data/navigation";
import { BootSequence } from "./BootSequence";
import { MiniMap } from "./MiniMap";
import { SectorTransition } from "./SectorTransition";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

interface SystemShellProps {
  children: ReactNode;
}

const BOOT_SESSION_KEY = "sf-ops-boot-complete";

export function SystemShell({ children }: SystemShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sector = getSectorFromPathname(pathname);
  const isHub = sector.id === "hub";
  const [bootState, setBootState] = useState<"checking" | "running" | "complete">("checking");

  useEffect(() => {
    queueMicrotask(() => {
      const bootComplete = window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true";
      setBootState(bootComplete ? "complete" : "running");
    });
  }, []);

  const completeBoot = useCallback(() => {
    window.sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    setBootState("complete");

    if (pathname !== "/") {
      router.replace("/");
    }
  }, [pathname, router]);

  return (
    <div className="system-shell" data-sector={sector.id} data-route={pathname} data-boot={bootState}>
      <div className="system-shell__haze" aria-hidden="true" />
      <div className="system-shell__grid" aria-hidden="true" />

      <header className="system-shell__header">
        <div className="system-shell__brand">
          <span className="system-shell__monogram">SF</span>
          <span className="system-shell__brand-text">
            Fisher <span aria-hidden="true">/</span> Operations
          </span>
        </div>

        <dl className="system-shell__meta">
          <div className="system-shell__meta-item">
            <dt>Sector</dt>
            <dd>
              {sectorCodes[sector.id]} {sector.label}
            </dd>
          </div>
          <div className="system-shell__meta-item">
            <dt>Coord</dt>
            <dd>{formatSectorCoordinates(sector)}</dd>
          </div>
        </dl>

        <StatusIndicator status={isHub ? "online" : "active"} label={isHub ? "System online" : "Sector active"} />
      </header>

      <main className="system-shell__content">
        <div className="system-shell__stage">
          <SectorTransition sectorId={sector.id} routeKey={pathname}>
            {children}
          </SectorTransition>
        </div>
        {!isHub && <MiniMap activeSector={sector.id} />}
      </main>

      <footer className="system-shell__footer">
        <span>SYS.2099 / Persistent shell</span>
        <span>{isHub ? "Hub topology" : "Minimap linked"}</span>
      </footer>

      {bootState === "running" && <BootSequence onComplete={completeBoot} />}
    </div>
  );
}
