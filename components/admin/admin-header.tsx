import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/keywords", label: "키워드" },
  { href: "/admin/briefs", label: "브리프" },
  { href: "/admin/drafts", label: "초안" },
  { href: "/admin/posts", label: "포스트" },
  { href: "/admin/analytics", label: "분석" },
];

export function AdminHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Current Affairs Admin</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
