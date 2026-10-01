"use client";

import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { sectors } from "@/data/navigation";
import { SiteIcon, type SiteIconName } from "@/components/ui/SiteIcon";
import type { JamalLink, JamalMessageRole } from "@/types/jamal";

export interface JamalDisplayMessage {
  id: string;
  role: JamalMessageRole;
  content: string;
  links?: JamalLink[];
}

interface JamalMessagesProps {
  messages: JamalDisplayMessage[];
  processing: boolean;
  onNavigate: () => void;
}

export function JamalMessages({ messages, processing, onNavigate }: JamalMessagesProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestMessageId = messages.at(-1)?.id;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const container = messagesRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [latestMessageId, processing, reduceMotion]);

  return (
    <div ref={messagesRef} className="jamal-messages" aria-live="polite" aria-busy={processing}>
      {messages.map((message) => (
        <article className="jamal-message" data-role={message.role} key={message.id}>
          <span>{message.role === "assistant" ? "JAMAL" : "VISITOR"}</span>
          <p>{message.content}</p>
          {message.links && message.links.length > 0 && (
            <nav className="jamal-message__links" aria-label="Suggested portfolio routes">
              {message.links.map((link) => (
                <JamalMessageLink link={link} onNavigate={onNavigate} key={link.href} />
              ))}
            </nav>
          )}
        </article>
      ))}

      {processing && (
        <div className="jamal-processing" role="status">
          <span aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Processing request
        </div>
      )}
    </div>
  );
}

function JamalMessageLink({ link, onNavigate }: { link: JamalLink; onNavigate: () => void }) {
  const content = (
    <>
      <JamalLinkIcon link={link} />
      <span>{link.label}</span>
      <i aria-hidden="true">→</i>
    </>
  );

  if (link.kind === "internal") {
    return (
      <Link href={link.href} onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  const newTab = link.kind === "external" || link.kind === "document";
  return (
    <a
      href={link.href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      onClick={onNavigate}
    >
      {content}
    </a>
  );
}

const contactIcons = new Set<SiteIconName>(["mail", "call", "linkedin", "github", "description"]);

function JamalLinkIcon({ link }: { link: JamalLink }) {
  if (contactIcons.has(link.icon as SiteIconName)) {
    return (
      <SiteIcon
        className="jamal-message__route-icon"
        name={link.icon as SiteIconName}
      />
    );
  }

  const sector = sectors.find((candidate) => candidate.id === link.icon);

  if (!sector?.icon) {
    return <i className="jamal-message__hub-icon" aria-hidden="true" />;
  }

  return (
    <Image
      className="jamal-message__route-icon"
      src={sector.icon}
      alt=""
      width={15}
      height={15}
      aria-hidden="true"
    />
  );
}
