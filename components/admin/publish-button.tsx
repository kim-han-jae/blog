"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PublishButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPublish() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/publish-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        setError(result?.error ?? "발행에 실패했습니다.");
        return;
      }
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button size="sm" onClick={onPublish} disabled={loading}>
        {loading ? "발행 중..." : "발행"}
      </Button>
      {error && <p className="max-w-xs text-xs text-rose-600">{error}</p>}
    </div>
  );
}
