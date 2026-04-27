import type { Metadata } from "next";

function resolveSiteUrl() {
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionDomain) return `https://${productionDomain}`;

  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const previewDomain = process.env.VERCEL_URL;
  if (previewDomain) return `https://${previewDomain}`;

  return "http://localhost:3000";
}

const siteUrl = resolveSiteUrl();
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "이슈있슈";

export const seoConfig = {
  siteUrl,
  siteName,
  defaultAuthor: process.env.NEXT_PUBLIC_SITE_AUTHOR ?? "이슈있슈 편집팀",
  locale: "ko_KR",
  defaultDescription:
    "키워드 수집부터 브리프, 초안, 검수, 발행까지 연결하는 검색 기반 콘텐츠 운영 도구",
  defaultKeywords: ["시사 이슈", "정책 분석", "경제 이슈", "이슈 브리프", "current affairs"],
};

export function buildCanonical(path = "/") {
  return new URL(path, siteUrl).toString();
}

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  openGraphType?: "website" | "article";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/opengraph-image",
  keywords = seoConfig.defaultKeywords,
  openGraphType = "website",
  noIndex = false,
}: MetaInput): Metadata {
  const canonical = buildCanonical(path);
  const imageUrl = new URL(image, siteUrl).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: openGraphType,
      title,
      description,
      url: canonical,
      siteName,
      locale: seoConfig.locale,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      geo_region: "KR",
      geo_placename: "South Korea",
    },
  };
}
