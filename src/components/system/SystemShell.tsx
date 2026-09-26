"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { formatSectorCoordinates, getSectorFromPathname, sectorCodes } from "@/data/navigation";
import { BootSequence } from "./BootSequence";
import { MiniMap } from "./MiniMap";
import { SectorTransition } from "./SectorTransition";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

interface SystemShellProps {
  children: ReactNode;
}

const BOOT_SESSION_KEY = "sf-ops-boot-complete";

function hasCompletedBoot() {
  try {
    return window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberCompletedBoot() {
  try {
    window.sessionStorage.setItem(BOOT_SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in restricted browser contexts. Boot completion
    // must still be allowed and must never affect the current route.
  }
}

export function SystemShell({ children }: SystemShellProps) {
  const pathname = usePathname();
  const sector = getSectorFromPathname(pathname);
  const isHub = sector.id === "hub";
  const [bootState, setBootState] = useState<"checking" | "running" | "complete">("checking");
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (pathname !== "/") {
        rememberCompletedBoot();
        setBootState("complete");
        return;
      }

      setBootState(hasCompletedBoot() ? "complete" : "running");
    });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const completeBoot = useCallback(() => {
    rememberCompletedBoot();
    setBootState("complete");
  }, []);

  const closeMobileNetwork = useCallback(() => {
    setMobileNetworkOpen(false);
  }, [setMobileNetworkOpen]);

  return (
    <div
      className="system-shell"
      data-sector={sector.id}
      data-route={pathname}
      data-boot={bootState}
      data-network-open={!isHub && mobileNetworkOpen ? true : undefined}
    >
      <div className="system-shell__haze" aria-hidden="true" />
      <div className="system-shell__grid" aria-hidden="true" />

      <header className="system-shell__header">
        <dl className="system-shell__meta">
          <div className="system-shell__meta-item system-shell__meta-item--section">
            <dt>Section</dt>
            <dd>
              {sectorCodes[sector.id]} {sector.label}
            </dd>
          </div>
          <div className="system-shell__meta-item system-shell__meta-item--coordinates">
            <dt>Coordinates</dt>
            <dd>{formatSectorCoordinates(sector)}</dd>
          </div>
        </dl>

        {!isHub && (
          <button
            className="system-shell__mobile-network-trigger"
            type="button"
            aria-expanded={mobileNetworkOpen}
            aria-controls="section-network-dialog"
            aria-label={
              mobileNetworkOpen
                ? "Close section network"
                : `Open section network. Current section: ${sector.label}`
            }
            onClick={() => setMobileNetworkOpen((open) => !open)}
          >
            <i aria-hidden="true" />
            <span>Section</span>
            <strong>{sectorCodes[sector.id]}</strong>
          </button>
        )}

        <StatusIndicator status="active" label="Section active" />
      </header>

      <main className="system-shell__content">
        <div className="system-shell__stage">
          <SectorTransition sectorId={sector.id} routeKey={pathname}>
            {children}
          </SectorTransition>
        </div>
        <MiniMap
          activeSector={sector.id}
          showCompact={!isHub}
          mobileOpen={!isHub && mobileNetworkOpen}
          onMobileClose={closeMobileNetwork}
        />
      </main>

      <footer className="system-shell__footer">
        <span>SYS-2099</span>
        <span>
          &copy; 2026 Spencer Fisher
          <span className="system-shell__footer-detail">{" // Personal interface"}</span>
        </span>
      </footer>

      {bootState === "running" && <BootSequence onComplete={completeBoot} />}
    </div>
  );
}
