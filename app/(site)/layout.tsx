import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/seo/json-ld";
import { AdsenseScript } from "@/components/seo/adsense-script";
import { createOrganizationSchema, createWebsiteSchema } from "@/lib/schema";
import { seoConfig } from "@/lib/seo";

const menus = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = createOrganizationSchema({
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo-issueisshu.svg`,
  });
  const websiteSchema = createWebsiteSchema({
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    searchPath: "/search",
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <AdsenseScript clientId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT} />
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Image
              src="/logo-issueisshu.svg"
              alt="이슈있슈 로고"
              width={42}
              height={14}
              priority
            />
            <span>이슈있슈</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            {menus.map((menu) => (
              <Link key={menu.href} href={menu.href}>
                {menu.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} 이슈있슈. All rights reserved.
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/about">소개</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/disclosure">광고 및 제휴 고지</Link>
          <Link href="/contact">문의하기</Link>
          <Link href="/ads.txt">ads.txt</Link>
        </div>
      </footer>
    </>
  );
}
