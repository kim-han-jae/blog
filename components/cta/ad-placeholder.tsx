import { AdsSlot } from "@/components/cta/ads-slot";

export function AdPlaceholder({
  label = "광고 영역",
  slot = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_IN_ARTICLE,
}: {
  label?: string;
  slot?: string;
}) {
  if (slot) {
    return (
      <div className="my-8 rounded-lg border border-zinc-200 bg-white p-4">
        <AdsSlot slot={slot} />
      </div>
    );
  }

  return (
    <div className="my-8 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
      {label}
    </div>
  );
}
