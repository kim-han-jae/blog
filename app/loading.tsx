import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
