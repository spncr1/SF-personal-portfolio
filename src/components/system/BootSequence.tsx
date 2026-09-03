"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { StartupHudGraphic } from "./StartupHudGraphic";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  { id: "connection", label: "Connection", value: "SYS-2099 channel established" },
  { id: "identity", label: "Identity", value: "Spencer Fisher profile verified" },
  { id: "archive", label: "Archive", value: "Operations archive unlocked" },
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
  const [statusLabel, setStatusLabel] = useState("Calibrating...");

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const meterPercent = q(".boot-sequence__meter-percent")[0] as HTMLElement | undefined;
    const meterProgress = { value: 0 };
    const ambientHudTweens: gsap.core.Tween[] = [];
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

    const killAmbientHudTweens = () => {
      ambientHudTweens.splice(0).forEach((tween) => tween.kill());
    };

    const startAmbientHudTweens = () => {
      if (ambientHudTweens.length > 0) return;

      ambientHudTweens.push(
        gsap.to(q(".startup-hud__outer-rings"), {
          rotate: 3,
          duration: 24,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          svgOrigin: "0 0",
        }),
        gsap.to(q(".startup-hud__segmented-rings"), {
          rotate: -8,
          duration: 34,
          ease: "none",
          repeat: -1,
          svgOrigin: "0 0",
        }),
        gsap.to(q(".startup-hud__inner-rings"), {
          rotate: 5,
          duration: 42,
          ease: "none",
          repeat: -1,
          svgOrigin: "0 0",
        }),
        gsap.to(q(".startup-hud__radial-ticks"), {
          rotate: -2,
          duration: 28,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          svgOrigin: "0 0",
        }),
        gsap.to(q(".startup-hud__glow-elements"), {
          opacity: 0.84,
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
      );
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      killAmbientHudTweens();
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
      .set(q(".startup-hud__central-hud"), { opacity: 0, scale: 0.98, svgOrigin: "0 0" })
      .set(q(".startup-hud__peripheral-hexes, .startup-hud__secondary-hexes, .startup-hud__primary-hexes"), { opacity: 0 })
      .set(q(".startup-hud__branches, .startup-hud__junction-nodes, .startup-hud__glow-elements"), { opacity: 0 })
      .fromTo(q(".boot-sequence__frame"), { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.38 })
      .fromTo(q(".boot-sequence__mark"), { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.44 }, "-=0.1")
      .to(q(".startup-hud__central-hud"), { opacity: 1, scale: 1, duration: 0.44, ease: "power2.out", svgOrigin: "0 0" }, "-=0.28")
      .to(q(".startup-hud__peripheral-hexes"), { opacity: 1, duration: 0.44, ease: "power1.out" }, "-=0.18")
      .to(q(".startup-hud__secondary-hexes"), { opacity: 1, duration: 0.38, ease: "power1.out" }, "-=0.26")
      .to(q(".startup-hud__primary-hexes"), { opacity: 1, duration: 0.32, ease: "power1.out" }, "-=0.22")
      .to(q(".startup-hud__branches, .startup-hud__junction-nodes"), { opacity: 1, duration: 0.34, ease: "power1.out" }, "-=0.2")
      .to(q(".startup-hud__glow-elements"), { opacity: 1, duration: 0.28, ease: "power1.out" }, "-=0.16")
      .call(startAmbientHudTweens, undefined, "-=0.1")
      .fromTo(q(".boot-sequence__vault"), { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.58 }, "-=0.18")
      .fromTo(q(".boot-sequence__ring"), { opacity: 0, rotate: -28, scale: 0.88 }, { opacity: 1, rotate: 0, scale: 1, duration: 0.62 }, "-=0.36")
      .fromTo(q(".boot-sequence__monogram"), { opacity: 0, scale: 0.56 }, { opacity: 1, scale: 1, duration: 0.52 }, "-=0.34")
      .fromTo(q(".boot-sequence__vault-ring"), { opacity: 0, rotate: -24 }, { opacity: 1, rotate: 0, duration: 0.72, stagger: 0.08 }, "-=0.42")
      .fromTo(q(".startup-hud__terminal-branch--secondary, .startup-hud__terminal-node--secondary"), { opacity: 0.08 }, { opacity: 0.44, duration: 0.28, yoyo: true, repeat: 1, ease: "sine.inOut", clearProps: "opacity" }, "-=0.28")
      .fromTo(q(".startup-hud__interface-link--primary, .startup-hud__topology-glow--interface"), { opacity: 0.18 }, { opacity: 0.78, duration: 0.32, yoyo: true, repeat: 1, ease: "sine.inOut", clearProps: "opacity" }, "-=0.1")
      .fromTo(q(".boot-sequence__vault-lock"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.34 }, "-=0.22")
      .to(q(".boot-sequence__vault-bar"), { scaleX: 1, duration: 0.48, stagger: 0.09, ease: "power1.inOut" })
      .fromTo(
        q(".boot-sequence__line"),
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, stagger: 0.28, duration: 0.34 },
        "-=0.08",
      )
      .call(() => setStatusLabel("Calibrating..."))
      .to(q(".boot-sequence__status"), { opacity: 1, duration: 0.18 })
      .fromTo(q(".boot-sequence__meter-fill"), { scaleX: 0 }, { scaleX: 1, duration: 2.15, ease: "power1.inOut" }, "-=0.02")
      .to(meterProgress, { value: 100, duration: 2.15, ease: "power1.inOut", onUpdate: updateMeterPercent }, "<")
      .to(q(".boot-sequence__status"), { opacity: 0, duration: 0.16 })
      .to(q(".boot-sequence__vault-lock"), { opacity: 0, scale: 0.82, duration: 0.22 }, "-=0.2")
      .to(q(".boot-sequence__vault-door--left"), { xPercent: -36, opacity: 0.48, duration: 0.42, ease: "power3.inOut" }, "-=0.08")
      .to(q(".boot-sequence__vault-door--right"), { xPercent: 36, opacity: 0.48, duration: 0.42, ease: "power3.inOut" }, "<")
      .to(q(".boot-sequence__ring"), { scale: 1.05, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.inOut" }, "-=0.08")
      .to(q(".boot-sequence__monogram"), { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" }, "<")
      .call(() => setStatusLabel("Click or press any key to enter"))
      .to(q(".boot-sequence__status"), { opacity: 1, duration: 0.24 })
      .to(root, { opacity: 1, duration: 0.22 });

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
      killAmbientHudTweens();
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
        <StartupHudGraphic />

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
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
