"use client";

import { useEffect, useMemo, useState } from "react";

export function PostViewCounter({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount: number;
}) {
  const [viewCount, setViewCount] = useState(initialCount);
  const formattedViewCount = useMemo(() => new Intl.NumberFormat("ko-KR").format(viewCount), [viewCount]);

  useEffect(() => {
    const sessionKey = `post-viewed:${slug}`;
    if (window.sessionStorage.getItem(sessionKey)) {
      return;
    }

    const controller = new AbortController();
    const track = async () => {
      try {
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
          method: "POST",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: { viewCount?: number } };
        if (typeof payload.data?.viewCount === "number") {
          setViewCount(payload.data.viewCount);
        }
        window.sessionStorage.setItem(sessionKey, "1");
      } catch {
        // Ignore tracking failures to avoid impacting article reading.
      }
    };

    void track();

    return () => {
      controller.abort();
    };
  }, [slug]);

  return <span>조회수: {formattedViewCount}</span>;
}
