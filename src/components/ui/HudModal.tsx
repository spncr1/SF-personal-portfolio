"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SiteIcon } from "./SiteIcon";

interface HudModalProps {
  open: boolean;
  title: string;
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
  size?: "standard" | "wide";
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function HudModal({
  open,
  title,
  ariaLabel,
  onClose,
  children,
  size = "standard",
}: HudModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const portalSync = window.setTimeout(() => setPortalRoot(document.body), 0);

    return () => window.clearTimeout(portalSync);
  }, []);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const shellContent = document.querySelector<HTMLElement>(".system-shell__content");
    const previousShellOverflow = shellContent?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    shellContent?.style.setProperty("overflow", "hidden");

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !panelRef.current.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !panelRef.current.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      shellContent?.style.setProperty("overflow", previousShellOverflow);

      if (previouslyFocusedRef.current?.isConnected) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open]);

  if (!open || !portalRoot) return null;

  return createPortal(
    <div className="hud-modal" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button
        className="hud-modal__backdrop"
        type="button"
        tabIndex={-1}
        aria-label={`Close ${ariaLabel}`}
        onClick={onClose}
      />

      <div className="hud-modal__panel" data-size={size} ref={panelRef} tabIndex={-1}>
        <div className="hud-modal__header">
          <strong>{title}</strong>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            <SiteIcon name="close" />
            Close
          </button>
        </div>

        {children}
      </div>
    </div>,
    portalRoot,
  );
}
