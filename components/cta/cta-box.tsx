"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CTABox({
  title,
  description,
  href,
  trackingSlug,
  trackingEventType = "cta",
}: {
  title: string;
  description: string;
  href: string;
  trackingSlug?: string;
  trackingEventType?: "cta" | "affiliate";
}) {
  function trackClick() {
    if (!trackingSlug) return;

    const endpoint = `/api/posts/${encodeURIComponent(trackingSlug)}/event`;
    const payload = JSON.stringify({ eventType: trackingEventType });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Ignore tracking failures to keep CTA navigation responsive.
    });
  }

  return (
    <Card className="border-zinc-300 bg-zinc-50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-zinc-600">{description}</p>
        <Link href={href} target="_blank" rel="noreferrer" onClick={trackClick}>
          <Button className="whitespace-nowrap">탐색해보세요</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
