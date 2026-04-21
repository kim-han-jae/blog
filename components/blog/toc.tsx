export function TableOfContents({ headings }: { headings: string[] }) {
  if (headings.length === 0) return null;

  return (
    <aside className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="mb-2 text-sm font-semibold">목차</h3>
      <ul className="space-y-1 text-sm text-zinc-600">
        {headings.map((heading) => (
          <li key={heading}>
            <a href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`}>{heading}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
