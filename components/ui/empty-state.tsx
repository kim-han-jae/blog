export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
