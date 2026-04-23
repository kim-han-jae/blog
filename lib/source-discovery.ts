import { validateSourceUrls } from "@/lib/sources";
import { isLikelyKoreanArticleUrl } from "@/lib/source-parser";

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function extractLinksFromRss(xml: string) {
  return [...xml.matchAll(/<link>(https?:\/\/[^<]+)<\/link>/gim)]
    .map((match) => decodeXml(match[1].trim()))
    .filter((value) => !value.includes("news.google.com/rss"))
    .filter((value) => !value.includes("/topics/"));
}

async function readGoogleNewsRss(query: string, locale: "ko" | "en") {
  const hl = locale === "ko" ? "ko" : "en-US";
  const gl = locale === "ko" ? "KR" : "US";
  const ceid = locale === "ko" ? "KR:ko" : "US:en";
  const endpoint = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(10000),
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; IssueIsshuBot/1.0; +https://blog-ruddy-two-82.vercel.app)",
    },
  });
  if (!response.ok) return [];
  const xml = await response.text();
  return extractLinksFromRss(xml);
}

export async function discoverArticleUrlsByKeyword(input: {
  keyword: string;
  koreanLimit?: number;
  globalLimit?: number;
}) {
  const koreanLimit = input.koreanLimit ?? 5;
  const globalLimit = input.globalLimit ?? 3;

  const [krNews, globalNews] = await Promise.all([
    readGoogleNewsRss(input.keyword, "ko"),
    readGoogleNewsRss(input.keyword, "en"),
  ]);

  const merged = [...new Set([...krNews, ...globalNews])];
  const { valid } = validateSourceUrls(merged);

  const korean = valid.filter((url) => isLikelyKoreanArticleUrl(url)).slice(0, koreanLimit);
  const global = valid.filter((url) => !isLikelyKoreanArticleUrl(url)).slice(0, globalLimit);

  return {
    urls: [...korean, ...global],
    koreanUrls: korean,
    globalUrls: global,
  };
}
