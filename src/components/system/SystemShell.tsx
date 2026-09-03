"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatSectorCoordinates, getSectorFromPathname, sectorCodes, sectors } from "@/data/navigation";
import { BootSequence } from "./BootSequence";
import { MiniMap } from "./MiniMap";
import { SectorTransition } from "./SectorTransition";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { SectorId } from "@/types/navigation";

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
  const [previewSectorId, setPreviewSectorId] = useState<SectorId | null>(null);
  const previewSector = isHub && previewSectorId
    ? sectors.find((candidate) => candidate.id === previewSectorId)
    : undefined;
  const displayedSector = previewSector ?? sector;

  useEffect(() => {
    queueMicrotask(() => {
      const bootComplete = window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true";
      setBootState(bootComplete ? "complete" : "running");
    });
  }, []);

  useEffect(() => {
    if (!isHub) {
      return;
    }

    const handlePreview = (event: Event) => {
      const detail = (event as CustomEvent<SectorId | null>).detail;
      const nextSectorId = detail && sectors.some((candidate) => candidate.id === detail)
        ? detail
        : null;

      setPreviewSectorId(nextSectorId);
    };

    window.addEventListener("sf-ops-section-preview", handlePreview);

    return () => {
      window.removeEventListener("sf-ops-section-preview", handlePreview);
    };
  }, [isHub]);

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
        <dl className="system-shell__meta">
          <div className="system-shell__meta-item">
            <dt>Section</dt>
            <dd>
              {sectorCodes[displayedSector.id]} {displayedSector.label}
            </dd>
          </div>
          <div className="system-shell__meta-item">
            <dt>Coordinates</dt>
            <dd>{formatSectorCoordinates(displayedSector)}</dd>
          </div>
        </dl>

        {isHub && (
          <div className="system-shell__hub-id" aria-hidden="true">
            <span>SF</span>
            <strong>Central Hub</strong>
          </div>
        )}

        {!isHub && <StatusIndicator status="active" label="Section active" />}
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
        <span>SYS-2099</span>
        <span>© 2026 Spencer Fisher / Personal interface</span>
      </footer>

      {bootState === "running" && <BootSequence onComplete={completeBoot} />}
    </div>
  );
}
