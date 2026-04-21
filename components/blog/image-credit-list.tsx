type CreditItem = {
  label: string;
  source: string;
};

export function ImageCreditList({
  title = "이미지 출처",
  items,
}: {
  title?: string;
  items?: CreditItem[];
}) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <ul className="space-y-1 text-sm text-zinc-600">
        {safeItems.map((item) => (
          <li key={`${item.label}-${item.source}`}>
            {item.label}:{" "}
            <a className="underline" href={item.source} target="_blank" rel="noreferrer">
              {item.source}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
