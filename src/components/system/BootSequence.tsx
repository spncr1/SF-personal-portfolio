"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  { id: "identify", label: "Identify", value: "SF monogram verified" },
  { id: "retrieve", label: "Retrieve", value: "Sector topology linked" },
  { id: "construct", label: "Construct", value: "Interface shell mounted" },
  { id: "ready", label: "Ready", value: "Central Hub access granted" },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const doneRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
      onComplete: finish,
    });

    timelineRef.current = timeline;
    timeline
      .set(root, { opacity: 1 })
      .fromTo(".boot-sequence__frame", { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.22 })
      .fromTo(".boot-sequence__monogram", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.42 })
      .fromTo(".boot-sequence__ring", { opacity: 0, rotate: -18 }, { opacity: 1, rotate: 0, duration: 0.45 }, "<0.08")
      .fromTo(
        ".boot-sequence__line",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.18, duration: 0.24 },
        "-=0.08",
      )
      .fromTo(".boot-sequence__meter-fill", { scaleX: 0 }, { scaleX: 1, duration: 0.92, ease: "power1.inOut" }, "-=0.08")
      .to(".boot-sequence__status", { opacity: 1, duration: 0.18 }, "-=0.2")
      .to(root, { opacity: 1, duration: 0.35 });

    const handleSkip = (event: KeyboardEvent | PointerEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Tab") return;
      finish();
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
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="System boot sequence"
      tabIndex={-1}
    >
      <div className="boot-sequence__frame">
        <div className="boot-sequence__mark" aria-hidden="true">
          <span className="boot-sequence__ring" />
          <span className="boot-sequence__monogram">SF</span>
        </div>

        <div className="boot-sequence__copy">
          <p className="boot-sequence__eyebrow">System startup</p>
          <h1 className="boot-sequence__title">Fisher Operations</h1>

          <ol className="boot-sequence__lines" aria-label="Boot progress">
            {bootLines.map((line) => (
              <li className="boot-sequence__line" key={line.id}>
                <span>{line.label}</span>
                <strong>{line.value}</strong>
              </li>
            ))}
          </ol>

          <div className="boot-sequence__meter" aria-hidden="true">
            <span className="boot-sequence__meter-fill" />
          </div>

          <p className="boot-sequence__status">Click or press any key to skip</p>
        </div>
      </div>
    </div>
  );
}
