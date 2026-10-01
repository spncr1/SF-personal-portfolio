"use client";

import Image from "next/image";

interface JamalIdentityMarkProps {
  compact?: boolean;
  bare?: boolean;
}

export function JamalIdentityMark({ compact = false, bare = false }: JamalIdentityMarkProps) {
  return (
    <span
      className="jamal-identity"
      data-compact={compact || undefined}
      data-bare={bare || undefined}
      aria-hidden="true"
    >
      <span className="jamal-identity__frame">
        <Image
          className="jamal-identity__portrait"
          src="/icons/jamal-icon-diagnostic.png"
          alt=""
          width={96}
          height={96}
          priority
        />
      </span>
      <span className="jamal-identity__core">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
