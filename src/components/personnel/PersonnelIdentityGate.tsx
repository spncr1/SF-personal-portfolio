"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { StartupHudGraphic } from "@/components/system/StartupHudGraphic";

interface PersonnelIdentityGateProps {
  portrait: string;
  onComplete: () => void;
}

export function PersonnelIdentityGate({ portrait, onComplete }: PersonnelIdentityGateProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [finished, setFinished] = useState(false);
  const [statusLabel, setStatusLabel] = useState("Scanning");
  const rootRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLSpanElement>(null);
  const meterFillRef = useRef<HTMLSpanElement>(null);
  const meterPercentRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const identityVerified = statusLabel === "Identity Verified";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".system-shell");
    shell?.setAttribute("data-personnel-gate", "scanning");

    return () => shell?.removeAttribute("data-personnel-gate");
  }, []);

  useEffect(() => {
    const portalSync = window.setTimeout(() => setPortalRoot(document.body), 0);

    return () => window.clearTimeout(portalSync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const scanLine = scanLineRef.current;
    const meterFill = meterFillRef.current;
    const meterPercent = meterPercentRef.current;

    if (!portalRoot || !root || !scanLine || !meterFill || !meterPercent) return;

    root.focus({ preventScroll: true });

    const shell = document.querySelector<HTMLElement>(".system-shell");
    const meterProgress = { value: 0 };
    const updateMeterPercent = () => {
      meterPercent.textContent = `${Math.round(meterProgress.value)}%`;
    };
    const resolveIdentity = () => {
      root.dataset.resolved = "true";
      setStatusLabel("Identity Verified");
    };
    const finishGate = () => {
      if (completedRef.current) return;

      completedRef.current = true;
      shell?.setAttribute("data-personnel-gate", "complete");
      setFinished(true);
      onCompleteRef.current();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(meterFill, { scaleX: 1 });
      meterProgress.value = 100;
      updateMeterPercent();
      root.dataset.resolved = "true";

      const reducedMotionTimer = window.setTimeout(() => {
        setStatusLabel("Identity Verified");
        finishGate();
      }, 80);

      return () => window.clearTimeout(reducedMotionTimer);
    }

    const timeline = gsap.timeline();

    timeline
      .set(meterFill, { scaleX: 0 })
      .set(scanLine, { top: "2%", opacity: 0.82 })
      .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power1.out" })
      .to(scanLine, { top: "98%", duration: 2.4, ease: "none" }, 0)
      .to(meterFill, { scaleX: 1, duration: 2.4, ease: "power1.inOut" }, 0)
      .to(meterProgress, { value: 100, duration: 2.4, ease: "power1.inOut", onUpdate: updateMeterPercent }, 0)
      .call(resolveIdentity)
      .to(root, { opacity: 1, duration: 0.32 })
      .to(root, { opacity: 0, duration: 0.28, ease: "power2.inOut", onComplete: finishGate });

    return () => timeline.kill();
  }, [portalRoot]);

  if (finished) return null;

  const gate = (
    <div
      className="personnel-gate"
      data-resolved={identityVerified}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Personnel identity verification"
      tabIndex={-1}
    >
      <div className="personnel-gate__ambient" aria-hidden="true">
        <StartupHudGraphic />
      </div>

      <div className="personnel-gate__content">
        <header className="personnel-gate__header">
          <p>SYS-2099 Identity Verification</p>
          <h1 aria-live="polite">{statusLabel}</h1>
        </header>

        <div className="personnel-gate__scan-stage">
          <div className="personnel-gate__portrait-frame">
            <span className="personnel-gate__corner personnel-gate__corner--top-left" aria-hidden="true" />
            <span className="personnel-gate__corner personnel-gate__corner--top-right" aria-hidden="true" />
            <span className="personnel-gate__corner personnel-gate__corner--bottom-left" aria-hidden="true" />
            <span className="personnel-gate__corner personnel-gate__corner--bottom-right" aria-hidden="true" />

            <div className="personnel-gate__portrait-clip">
              <Image
                src={portrait}
                alt="Portrait of Spencer Fisher"
                fill
                sizes="200px"
                priority
              />

              <svg
                className="personnel-gate__face-map"
                viewBox="0 0 200 250"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M48 76 Q49 44 100 42 Q151 44 152 76 L157 111 L149 148 Q140 181 100 197 Q60 181 51 148 L43 111 Z" />
                <path d="M48 76 L75 108 L100 42 L125 108 L152 76" />
                <path d="M58 113 L80 106 M120 106 L143 113" />
                <path d="M58 124 Q70 118 82 124 M118 124 Q130 118 143 124" />
                <path d="M100 112 L93 149 L101 155 L109 149" />
                <path d="M77 166 Q100 178 123 166 M84 175 Q100 183 116 175" />
                <path d="M43 111 L58 124 L51 148 L77 166 L100 197 L123 166 L149 148 L143 124 L157 111" />
                <g>
                  <circle cx="48" cy="76" r="2" />
                  <circle cx="75" cy="108" r="2" />
                  <circle cx="100" cy="42" r="2" />
                  <circle cx="125" cy="108" r="2" />
                  <circle cx="152" cy="76" r="2" />
                  <circle cx="58" cy="124" r="2" />
                  <circle cx="100" cy="155" r="2" />
                  <circle cx="143" cy="124" r="2" />
                  <circle cx="77" cy="166" r="2" />
                  <circle cx="123" cy="166" r="2" />
                  <circle cx="100" cy="197" r="2" />
                </g>
              </svg>

              <span className="personnel-gate__scan-line" ref={scanLineRef} aria-hidden="true" />
            </div>
          </div>
        </div>

        <p className="personnel-gate__subject" data-visible={identityVerified} aria-live="polite">
          {identityVerified ? "Spencer Fisher // Personnel Record" : null}
        </p>

        <div className="boot-sequence__meter-row personnel-gate__meter-row" aria-hidden="true">
          <div className="boot-sequence__meter">
            <span className="boot-sequence__meter-fill" ref={meterFillRef} />
          </div>
          <span className="boot-sequence__meter-percent" ref={meterPercentRef}>0%</span>
        </div>
      </div>
    </div>
  );

  return portalRoot ? createPortal(gate, portalRoot) : gate;
}
