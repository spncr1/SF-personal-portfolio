"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  { id: "connection", label: "Connection", value: "SYS-2099 channel established" },
  { id: "identity", label: "Identity", value: "Spencer Fisher profile verified" },
  { id: "vault", label: "Vault", value: "Operations archive unlocked" },
  { id: "network", label: "Network", value: "Section routes linked" },
  { id: "ready", label: "Ready", value: "Central Hub access granted" },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const doneRef = useRef(false);
  const readyRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const meterPercent = q(".boot-sequence__meter-percent")[0] as HTMLElement | undefined;
    const meterProgress = { value: 0 };
    const updateMeterPercent = () => {
      if (!meterPercent) return;
      meterPercent.textContent = `${Math.round(meterProgress.value)}%`;
    };

    updateMeterPercent();

    const markReady = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      setIsReady(true);
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      timelineRef.current?.kill();

      gsap.to(root, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.inOut",
        onComplete: () => completeRef.current(),
      });
    };

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: markReady,
    });

    timelineRef.current = timeline;
    timeline
      .set(root, { opacity: 1 })
      .set(q(".boot-sequence__status"), { opacity: 0 })
      .fromTo(q(".boot-sequence__frame"), { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.34 })
      .fromTo(q(".boot-sequence__vault"), { opacity: 0, scale: 0.78 }, { opacity: 1, scale: 1, duration: 0.48 }, "-=0.05")
      .fromTo(q(".boot-sequence__vault-ring"), { opacity: 0, rotate: -22 }, { opacity: 1, rotate: 0, duration: 0.62, stagger: 0.08 }, "-=0.18")
      .fromTo(q(".boot-sequence__vault-lock"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, "-=0.18")
      .to(q(".boot-sequence__vault-bar"), { scaleX: 1, duration: 0.42, stagger: 0.08, ease: "power1.inOut" })
      .fromTo(
        q(".boot-sequence__line"),
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.24, duration: 0.3 },
        "-=0.15",
      )
      .fromTo(q(".boot-sequence__meter-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power1.inOut" }, "-=0.1")
      .to(meterProgress, { value: 100, duration: 1.8, ease: "power1.inOut", onUpdate: updateMeterPercent }, "<")
      .to(q(".boot-sequence__vault-lock"), { opacity: 0, scale: 0.82, duration: 0.22 }, "-=0.2")
      .to(q(".boot-sequence__vault-door--left"), { xPercent: -36, opacity: 0.48, duration: 0.42, ease: "power3.inOut" }, "-=0.08")
      .to(q(".boot-sequence__vault-door--right"), { xPercent: 36, opacity: 0.48, duration: 0.42, ease: "power3.inOut" }, "<")
      .fromTo(q(".boot-sequence__monogram"), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.46 }, "-=0.22")
      .fromTo(q(".boot-sequence__ring"), { opacity: 0, rotate: -18 }, { opacity: 1, rotate: 0, duration: 0.5 }, "<0.06")
      .to(q(".boot-sequence__status"), { opacity: 1, duration: 0.24 })
      .to(root, { opacity: 1, duration: 0.4 });

    const handleSkip = (event: KeyboardEvent | PointerEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Tab") return;
      if (readyRef.current) {
        finish();
        return;
      }

      timeline.progress(1, false);
    };

    window.addEventListener("keydown", handleSkip);
    root.addEventListener("pointerdown", handleSkip);

    return () => {
      timeline.kill();
      window.removeEventListener("keydown", handleSkip);
      root.removeEventListener("pointerdown", handleSkip);
    };
  }, []);

  return (
    <div
      className="boot-sequence"
      data-ready={isReady}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="System boot sequence"
      tabIndex={-1}
    >
      <div className="boot-sequence__frame">
        <div className="boot-sequence__mark" aria-hidden="true">
          <span className="boot-sequence__ring" />
          <span className="boot-sequence__vault">
            <span className="boot-sequence__vault-ring boot-sequence__vault-ring--outer" />
            <span className="boot-sequence__vault-ring boot-sequence__vault-ring--inner" />
            <span className="boot-sequence__vault-door boot-sequence__vault-door--left" />
            <span className="boot-sequence__vault-door boot-sequence__vault-door--right" />
            <span className="boot-sequence__vault-lock">
              <span className="boot-sequence__vault-bar" />
              <span className="boot-sequence__vault-bar" />
              <span className="boot-sequence__vault-bar" />
            </span>
          </span>
          <span className="boot-sequence__monogram">
            <Image
              src="/brand/spencer-fisher-logo.png"
              alt=""
              width={160}
              height={160}
              style={{ width: "100%", height: "100%" }}
              priority
            />
          </span>
        </div>

        <div className="boot-sequence__copy">
          <p className="boot-sequence__eyebrow">SYS-2099 startup</p>
          <h1 className="boot-sequence__title">SF-Operations</h1>

          <ol className="boot-sequence__lines" aria-label="Boot progress">
            {bootLines.map((line) => (
              <li className="boot-sequence__line" key={line.id}>
                <span>{line.label}</span>
                <strong>{line.value}</strong>
              </li>
            ))}
          </ol>

          <div className="boot-sequence__meter-row" aria-hidden="true">
            <div className="boot-sequence__meter">
              <span className="boot-sequence__meter-fill" />
            </div>
            <span className="boot-sequence__meter-percent">0%</span>
          </div>

          <p className="boot-sequence__status" aria-live="polite">
            {isReady ? "Click or press any key to enter" : "Initializing secure interface"}
          </p>
        </div>
      </div>
    </div>
  );
}
