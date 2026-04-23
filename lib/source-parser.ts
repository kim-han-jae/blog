import { validateSourceUrls } from "@/lib/sources";

export type ParsedSource = {
  url: string;
  finalUrl: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  author?: string;
  publishedAt?: string;
  contentText: string;
};

type ParseResult =
  | { ok: true; item: ParsedSource }
  | { ok: false; url: string; error: string };

const koreanMediaDomainHints = [
  ".kr",
  "chosun.com",
  "joongang.co.kr",
  "donga.com",
  "hani.co.kr",
  "khan.co.kr",
  "mk.co.kr",
  "hankyung.com",
  "newsis.com",
  "yna.co.kr",
  "ytn.co.kr",
  "sbs.co.kr",
  "kbs.co.kr",
  "mbc.co.kr",
  "jtbc.co.kr",
  "ohmynews.com",
  "nocutnews.co.kr",
  "edaily.co.kr",
  "asiae.co.kr",
  "seoul.co.kr",
  "news.naver.com",
  "news.daum.net",
];

export function isLikelyKoreanArticleUrl(rawUrl: string) {
  try {
    const { hostname, pathname } = new URL(rawUrl);
    const target = `${hostname}${pathname}`.toLowerCase();
    return koreanMediaDomainHints.some((hint) => target.includes(hint));
  } catch {
    return false;
  }
}

export function prioritizeSourceUrls(urls: string[]) {
  const korean: string[] = [];
  const global: string[] = [];

  for (const url of urls) {
    if (isLikelyKoreanArticleUrl(url)) korean.push(url);
    else global.push(url);
  }

  return { ordered: [...korean, ...global], koreanCount: korean.length, globalCount: global.length };
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function readMeta(html: string, key: string, attr: "property" | "name" = "property") {
  const pattern = new RegExp(
    `<meta[^>]*${attr}=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const reversePattern = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*${attr}=["']${key}["'][^>]*>`,
    "i",
  );
  const hit = html.match(pattern) ?? html.match(reversePattern);
  return hit ? decodeHtml(hit[1]).trim() : "";
}

function readTitle(html: string) {
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return titleTag ? normalizeWhitespace(decodeHtml(stripTags(titleTag[1]))) : "";
}

function readJsonLdPublishedAt(html: string) {
  const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block[1]);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      for (const record of records) {
        const published = record?.datePublished;
        if (typeof published === "string" && published.length > 0) return published;
      }
    } catch {
      continue;
    }
  }
  return "";
}

function extractReadableText(html: string) {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const candidate = articleMatch?.[1] ?? mainMatch?.[1] ?? bodyMatch?.[1] ?? html;
  const sanitized = candidate
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  const paragraphs = [...sanitized.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalizeWhitespace(decodeHtml(stripTags(match[1]))))
    .filter((text) => text.length >= 60);

  if (paragraphs.length > 0) {
    return paragraphs.slice(0, 8).join("\n\n");
  }

  return normalizeWhitespace(decodeHtml(stripTags(sanitized))).slice(0, 3000);
}

async function parseSingleUrl(url: string): Promise<ParseResult> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; IssueIsshuBot/1.0; +https://blog-ruddy-two-82.vercel.app)",
      },
    });

    if (!response.ok) {
      return { ok: false, url, error: `Fetch failed with status ${response.status}` };
    }

    const finalUrl = response.url;
    const html = await response.text();
    const title = readMeta(html, "og:title") || readTitle(html);
    const description =
      readMeta(html, "og:description") || readMeta(html, "description", "name");
    const image = readMeta(html, "og:image") || readMeta(html, "twitter:image");
    const siteName = readMeta(html, "og:site_name");
    const author = readMeta(html, "author", "name") || readMeta(html, "article:author");
    const publishedAt =
      readMeta(html, "article:published_time") || readJsonLdPublishedAt(html);
    const contentText = extractReadableText(html);

    if (!title && !description && !contentText) {
      return { ok: false, url, error: "Could not extract meaningful content" };
    }

    return {
      ok: true,
      item: {
        url,
        finalUrl,
        title: title || "제목 미확인",
        description: description || contentText.slice(0, 220),
        image: image || undefined,
        siteName: siteName || undefined,
        author: author || undefined,
        publishedAt: publishedAt || undefined,
        contentText,
      },
    };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error instanceof Error ? error.message : "Unknown parsing error",
    };
  }
}

export async function parseSourceUrls(urls: string[]) {
  const { valid, invalid } = validateSourceUrls(urls);
  const uniqueValid = [...new Set(valid)];
  const prioritized = prioritizeSourceUrls(uniqueValid);

  const parsed = await Promise.all(prioritized.ordered.map((url) => parseSingleUrl(url)));
  const items = parsed.filter((result): result is { ok: true; item: ParsedSource } => result.ok);
  const failed = parsed
    .filter((result): result is { ok: false; url: string; error: string } => !result.ok)
    .map((result) => ({ url: result.url, error: result.error }));

  return {
    items: items.map((result) => result.item),
    invalidUrls: invalid,
    failed,
    orderedUrls: prioritized.ordered,
    koreanFirstApplied: prioritized.koreanCount > 0,
    koreanCandidateCount: prioritized.koreanCount,
    globalCandidateCount: prioritized.globalCount,
  };
}
