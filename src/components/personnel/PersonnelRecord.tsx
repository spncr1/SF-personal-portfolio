"use client";

import { useCallback, useEffect, useState } from "react";
import { HudModal } from "@/components/ui/HudModal";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { profile, type PersonalInterest } from "@/data/profile";
import { PersonalInterestIcon } from "./PersonalInterestIcon";
import { PersonnelIdentityGate } from "./PersonnelIdentityGate";
import { PersonnelPortrait } from "./PersonnelPortrait";

export function PersonnelRecord() {
  const [gateComplete, setGateComplete] = useState(false);
  const [gateRunId, setGateRunId] = useState(0);
  const [activeInterest, setActiveInterest] = useState<PersonalInterest | null>(null);
  const completeGate = useCallback(() => setGateComplete(true), []);
  const closeInterest = useCallback(() => setActiveInterest(null), []);

  useEffect(() => {
    const replayGateAfterHistoryRestore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;

      setActiveInterest(null);
      setGateComplete(false);
      setGateRunId((currentRunId) => currentRunId + 1);
    };

    window.addEventListener("pageshow", replayGateAfterHistoryRestore);

    return () => window.removeEventListener("pageshow", replayGateAfterHistoryRestore);
  }, []);

  return (
    <section className="sector sector--personnel sector-frame personnel-record" data-gate={gateComplete ? "complete" : "scanning"}>
      <PersonnelIdentityGate
        key={gateRunId}
        portrait={profile.identityPortrait}
        onComplete={completeGate}
      />

      <div
        className="personnel-record__content"
        aria-hidden={!gateComplete}
        inert={gateComplete ? undefined : true}
      >
        <div className="sector-frame__masthead">
          <div>
            <SystemLabel>Who is Spencer Fisher?</SystemLabel>
            <h1>Personnel File</h1>
          </div>
        </div>

        <div className="personnel-record__layout">
          <div className="personnel-record__column personnel-record__column--profile">
            <section className="personnel-record__section personnel-record__summary">
              <SystemLabel variant="secondary">Summary</SystemLabel>
              <p>{profile.summary}</p>
            </section>

            <section
              className="personnel-record__section personnel-record__service-log"
              id="personnel-service-log"
            >
              <SystemLabel variant="secondary">Service Log</SystemLabel>
              <ol className="personnel-record__service-list" aria-label="Service log">
                {profile.serviceLog.map((entry, index) => (
                  <li key={entry.id} data-kind={entry.kind}>
                    <span className="personnel-record__service-node" aria-hidden="true" />
                    <div className="personnel-record__service-entry">
                      <div className="personnel-record__service-meta">
                        <span>LOG {String(index + 1).padStart(3, "0")}</span>
                        <span aria-hidden="true">-</span>
                        <time>{entry.date}</time>
                      </div>
                      <h3>{entry.title}</h3>
                      <p>{entry.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="personnel-record__column personnel-record__column--visual">
            <div className="personnel-record__visual">
              {gateComplete ? (
                <div className="personnel-record__visual-composition">
                  <PersonnelPortrait portrait={profile.personnelPortrait} />

                  <div className="personnel-interests" aria-label="Personal interests">
                    {profile.personalInterests.map((interest) => (
                      <button
                        className="personnel-interest"
                        data-active={activeInterest?.id === interest.id}
                        data-interest={interest.id}
                        type="button"
                        aria-label={`Open ${interest.name} personal interest`}
                        aria-haspopup="dialog"
                        aria-expanded={activeInterest?.id === interest.id}
                      key={interest.id}
                      onClick={() => setActiveInterest(interest)}
                    >
                        <span className="personnel-interest__hex" aria-hidden="true">
                          <PersonalInterestIcon icon={interest.icon} />
                        </span>
                        <span className="personnel-interest__label">{interest.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <section
              className="personnel-record__section personnel-record__career-direction"
              id="personnel-career-direction"
            >
              <SystemLabel variant="secondary">Career Direction</SystemLabel>
              <p>{profile.careerDirection}</p>
            </section>
          </div>

          <nav className="personnel-record__mobile-section-nav" aria-label="Personnel file sections">
            <a href="#personnel-career-direction">
              <span>Career Direction</span>
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#personnel-service-log">
              <span>Service Log</span>
              <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </div>
      </div>

      <HudModal
        open={activeInterest !== null}
        title={activeInterest?.code ?? "Personal Interest"}
        ariaLabel={activeInterest ? `${activeInterest.name} personal interest` : "Personal interest"}
        onClose={closeInterest}
      >
        {activeInterest ? (
          <div className="personnel-interest-modal">
            <div className="personnel-interest-modal__hex" aria-hidden="true">
              <PersonalInterestIcon icon={activeInterest.icon} />
            </div>
            <div className="personnel-interest-modal__copy">
              <h2>{activeInterest.name}</h2>
              <p>{activeInterest.description}</p>
            </div>
          </div>
        ) : null}
      </HudModal>
    </section>
  );
}
