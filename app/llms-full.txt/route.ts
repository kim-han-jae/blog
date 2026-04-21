import { getAllPosts } from "@/lib/posts";
import { seoConfig } from "@/lib/seo";

export async function GET() {
  const posts = await getAllPosts();

  const body = [
    `# ${seoConfig.siteName} - LLM 상세 컨텍스트`,
    "",
    "## 편집 원칙",
    "1. 기사 원문 복붙 대신 사실 요약 + 맥락 설명 + 출처 링크 제공",
    "2. 과장/선동 표현을 피하고 검증 가능한 정보 우선",
    "3. 시간 민감 이슈는 작성일/갱신일 명시",
    "",
    "## 콘텐츠 구조",
    "- 글 유형: 브리프, 이슈 설명, 체크리스트, 비교 분석",
    "- 대상 독자: 시사 흐름을 빠르게 파악하려는 일반 독자 및 실무자",
    "- 핵심 가치: 짧은 시간에 핵심 맥락 이해",
    "",
    "## 중요 URL",
    `- 홈페이지: ${seoConfig.siteUrl}/`,
    `- 블로그 목록: ${seoConfig.siteUrl}/blog`,
    `- 검색: ${seoConfig.siteUrl}/search`,
    `- 사이트맵: ${seoConfig.siteUrl}/sitemap.xml`,
    `- RSS: ${seoConfig.siteUrl}/rss.xml`,
    "",
    "## 게시 글 인덱스",
    ...posts.map(
      (post) =>
        `- ${post.title} | 카테고리: ${post.category} | 태그: ${post.tags.join(", ") || "-"} | URL: ${seoConfig.siteUrl}/blog/${post.slug}`,
    ),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
