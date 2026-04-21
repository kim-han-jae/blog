import { Badge } from "@/components/ui/badge";

const variantMap: Record<string, "default" | "success" | "warning" | "danger"> = {
  NEW: "default",
  BRIEFED: "warning",
  APPROVED: "success",
  DRAFTED: "warning",
  REVIEWED: "success",
  PUBLISHED: "success",
  ARCHIVED: "danger",
  PENDING: "warning",
  REJECTED: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={variantMap[status] ?? "default"}>{status}</Badge>;
}
