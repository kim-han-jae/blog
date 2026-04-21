import { getAllPosts } from "@/lib/posts";
import { seoConfig } from "@/lib/seo";

export async function GET() {
  const posts = await getAllPosts();
  const latest = posts.slice(0, 20);

  const body = [
    `# ${seoConfig.siteName}`,
    "",
    `> ${seoConfig.defaultDescription}`,
    "",
    "## 사이트 요약",
    "- 주제: 한국/글로벌 시사 이슈, 정책, 경제, 사회 이슈 분석",
    "- 언어: ko-KR",
    "- 목적: 사실 기반 이슈 설명과 맥락 정리",
    "",
    "## 크롤링 참고 URL",
    `- 사이트맵: ${seoConfig.siteUrl}/sitemap.xml`,
    `- RSS: ${seoConfig.siteUrl}/rss.xml`,
    `- 상세 가이드: ${seoConfig.siteUrl}/llms-full.txt`,
    "",
    "## 최신 글",
    ...latest.map((post) => `- ${post.title}: ${seoConfig.siteUrl}/blog/${post.slug}`),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
