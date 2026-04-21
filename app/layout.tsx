import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { seoConfig } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: `${seoConfig.siteName} | 검색 기반 콘텐츠 운영`,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  applicationName: seoConfig.siteName,
  referrer: "origin-when-cross-origin",
  category: "news",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${seoConfig.siteName} RSS` }],
    },
  },
  icons: {
    icon: "/logo-issueisshu.svg",
    apple: "/logo-issueisshu.svg",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
