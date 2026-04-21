"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdsSlotProps = {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
};

export function AdsSlot({
  slot,
  className,
  format = "auto",
  responsive = true,
}: AdsSlotProps) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers can prevent ad script execution.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
