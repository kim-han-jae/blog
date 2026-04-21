import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-4 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
