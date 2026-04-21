"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ApiAction = {
  label: string;
  endpoint: string;
  body?: Record<string, unknown>;
};

const actions: ApiAction[] = [
  { label: "키워드 동기화", endpoint: "/api/keyword-sync" },
  { label: "브리프 생성", endpoint: "/api/brief-generate" },
  { label: "초안 생성", endpoint: "/api/draft-generate" },
  { label: "분석 동기화", endpoint: "/api/analytics-sync" },
];

export function AdminActions() {
  const [loading, setLoading] = useState<string | null>(null);

  async function execute(action: ApiAction) {
    setLoading(action.endpoint);
    try {
      await fetch(action.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.body ?? {}),
      });
      window.location.reload();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.endpoint}
          variant="secondary"
          onClick={() => execute(action)}
          disabled={loading === action.endpoint}
        >
          {loading === action.endpoint ? "처리 중..." : action.label}
        </Button>
      ))}
    </div>
  );
}
