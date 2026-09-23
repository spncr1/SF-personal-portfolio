"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { connections, sectors } from "@/data/navigation";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { MiniMapHexBackdrop } from "./MiniMapHexBackdrop";
import { getHexBoundaryPoint, hexPoints } from "@/lib/networkGeometry";

interface MiniMapProps {
  activeSector?: string;
  showCompact?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function MiniMap({
  activeSector,
  showCompact = true,
  mobileOpen = false,
  onMobileClose,
}: MiniMapProps) {
  const nodes = sectors.filter((sector) => sector.id !== "hub");
  const active = nodes.find((sector) => sector.id === activeSector);
  const [expanded, setExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const networkOpen = expanded || mobileOpen;

  const closeNetwork = useCallback(() => {
    setExpanded(false);
    onMobileClose?.();
  }, [onMobileClose]);

  useEffect(() => {
    if (!networkOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => {
      const preferredTarget = modalRef.current?.querySelector<HTMLElement | SVGElement>(
        '[aria-current="page"], .minimap__core-link',
      );
      const fallbackTarget = modalRef.current ? getFocusableElements(modalRef.current)[0] : null;

      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (preferredTarget) {
        preferredTarget.focus();
      } else if (fallbackTarget) {
        fallbackTarget.focus();
      } else {
        modalRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeNetwork();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!activeElement || !modalRef.current.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [closeNetwork, networkOpen]);

  return (
    <>
      {showCompact && (
        <HudPanel className="minimap">
          <div className="minimap__title">
            <SystemLabel variant="secondary">{active ? active.label : "Unknown"}</SystemLabel>
          </div>

          <NetworkCanvasFrame activeSector={activeSector} compact />

          <div className="minimap__actions">
            <button
              className="minimap__expand"
              type="button"
              aria-label="Expand network map"
              ref={expandButtonRef}
              onClick={() => setExpanded(true)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </HudPanel>
      )}

      {networkOpen && (
        <div
          className="minimap-modal"
          id="section-network-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Section network"
          data-mobile-open={mobileOpen || undefined}
          ref={modalRef}
          tabIndex={-1}
        >
          <button
            className="minimap-modal__backdrop"
            type="button"
            aria-label="Close network map"
            tabIndex={-1}
            onClick={closeNetwork}
          />
          <div className="minimap-modal__panel">
            {!mobileOpen && <MiniMapHexBackdrop />}
            {!mobileOpen && (
              <div className="minimap-modal__header">
                <SystemLabel>Section Network</SystemLabel>
                <button type="button" ref={closeButtonRef} onClick={closeNetwork}>
                  <SiteIcon name="close" />
                  Close
                </button>
              </div>
            )}
            <NetworkCanvasFrame activeSector={activeSector} onNavigate={closeNetwork} />
          </div>
        </div>
      )}
    </>
  );
}

interface NetworkCanvasProps {
  activeSector?: string;
  compact?: boolean;
  onNavigate?: () => void;
}

function NetworkCanvasFrame({ activeSector, compact = false, onNavigate }: NetworkCanvasProps) {
  return (
    <div className={compact ? "minimap__viewport minimap__viewport--compact" : "minimap__viewport minimap__viewport--expanded"}>
      <NetworkCanvas activeSector={activeSector} compact={compact} onNavigate={onNavigate} />
    </div>
  );
}

function NetworkCanvas({ activeSector, compact = false, onNavigate }: NetworkCanvasProps) {
  const router = useRouter();
  const nodes = sectors.filter((sector) => sector.id !== "hub");
  const hub = sectors.find((sector) => sector.id === "hub");

  const returnToHub = () => {
    onNavigate?.();
    router.push("/");
  };

  return (
    <svg
      className={compact ? "minimap__canvas minimap__canvas--compact" : "minimap__canvas minimap__canvas--expanded"}
      viewBox="0 0 100 100"
      role="navigation"
      aria-label="Section network map"
    >
      {hub &&
        connections.map((conn) => {
          const from = sectors.find((s) => s.id === conn.from);
          const to = sectors.find((s) => s.id === conn.to);
          if (!from || !to) return null;
          const fromCenter = { x: from.coordinates.x * 100, y: from.coordinates.y * 100 };
          const toCenter = { x: to.coordinates.x * 100, y: to.coordinates.y * 100 };
          const start = getHexBoundaryPoint(fromCenter, toCenter, compact ? 5 : 7);
          const end = getHexBoundaryPoint(toCenter, fromCenter, compact ? 4 : 5);

          return (
            <line
              key={`${conn.from}-${conn.to}`}
              className="minimap__path"
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
            />
          );
        })}

      {hub && (
        <g
          aria-label="Central Hub"
          aria-current={activeSector === "hub" ? "page" : undefined}
          className="minimap__core-link"
          role="link"
          tabIndex={0}
          onClick={returnToHub}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              returnToHub();
            }
          }}
        >
          {!compact && (
            <circle
              className="minimap__hit-target"
              cx={hub.coordinates.x * 100}
              cy={hub.coordinates.y * 100}
              r="8"
            />
          )}
          <polygon
            className={activeSector === "hub" ? "minimap__core minimap__core--active" : "minimap__core"}
            points={hexPoints(hub.coordinates.x * 100, hub.coordinates.y * 100, compact ? 5 : 7)}
          />
          {!compact && (
            <text
              className="minimap__core-label"
              x={hub.coordinates.x * 100}
              y={hub.coordinates.y * 100 + 13}
              textAnchor="middle"
            >
              Central Hub
            </text>
          )}
        </g>
      )}

      {nodes.map((sector) => {
        const cx = sector.coordinates.x * 100;
        const cy = sector.coordinates.y * 100;
        const isActive = activeSector === sector.id;
        return (
          <a
            key={sector.id}
            href={sector.route}
            aria-label={sector.label}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "minimap__node-link minimap__node-link--active" : "minimap__node-link"}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
              }

              event.preventDefault();
              onNavigate?.();
              router.push(sector.route);
            }}
          >
            {!compact && <circle className="minimap__hit-target" cx={cx} cy={cy} r="7" />}
            <polygon
              className={isActive ? "minimap__node minimap__node--active" : "minimap__node"}
              points={hexPoints(cx, cy, compact ? 4 : 5)}
              data-sector={sector.id}
            />
            {!compact && (
              <>
                {sector.icon && (
                  <image
                    className="minimap__node-icon"
                    href={sector.icon}
                    x={cx - 2.8}
                    y={cy - 2.8}
                    width="5.6"
                    height="5.6"
                    aria-hidden="true"
                  />
                )}
                <text className="minimap__node-label" x={cx} y={cy + 11} textAnchor="middle">
                  {sector.shortLabel}
                </text>
              </>
            )}
          </a>
        );
      })}
    </svg>
  );
}

function getFocusableElements(root: HTMLElement): Array<HTMLElement | SVGElement> {
  return Array.from(
    root.querySelectorAll<HTMLElement | SVGElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => {
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element instanceof HTMLElement && element.hidden) return false;

    return true;
  });
}
