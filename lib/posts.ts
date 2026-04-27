import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { UnifiedPost } from "@/types/post";
import type { ParsedSource } from "@/lib/source-parser";

const contentDir = path.join(process.cwd(), "content", "posts");

type Frontmatter = {
  title?: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  publishedAt?: string;
};

function normalizeThumbnail(value?: string | null) {
  if (!value) return "/thumbnails/issue-default.svg";
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return "/thumbnails/issue-default.svg";
}

async function getFilePosts(): Promise<UnifiedPost[]> {
  try {
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const parsed = await Promise.all(
      mdxFiles.map(async (filename) => {
        const fullPath = path.join(contentDir, filename);
        const raw = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(raw);
        const fm = data as Frontmatter;
        const slug = filename.replace(/\.mdx$/, "");
        return {
          id: `file-${slug}`,
          slug,
          title: fm.title ?? slug,
          excerpt: fm.excerpt ?? "",
          contentMdx: content,
          thumbnail: normalizeThumbnail(fm.thumbnail),
          category: fm.category ?? "일반",
          tags: fm.tags ?? [],
          isPublished: fm.isPublished ?? true,
          publishedAt: fm.publishedAt ? new Date(fm.publishedAt) : new Date(),
          createdAt: new Date(),
          source: "file" as const,
          seoTitle: fm.seoTitle,
          metaDescription: fm.metaDescription,
          faqJson: null,
          viewCount: 0,
        };
      }),
    );

    return parsed;
  } catch {
    return [];
  }
}

async function getDbPosts(): Promise<UnifiedPost[]> {
  if (!process.env.DATABASE_URL) return [];

  let rows: Awaited<ReturnType<typeof prisma.post.findMany>>;
  try {
    rows = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }

  return rows.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    contentMdx: post.contentMdx,
    thumbnail: normalizeThumbnail(post.ogImage),
    category: post.category,
    tags: post.tags,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    source: "db" as const,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    faqJson: post.faqJson,
    viewCount: 0,
  }));
}

export async function getAllPosts(includeDraft = false) {
  const [dbPosts, filePosts] = await Promise.all([getDbPosts(), getFilePosts()]);
  const merged = [...dbPosts, ...filePosts];
  const deduped = merged.filter(
    (post, index, arr) => arr.findIndex((item) => item.slug === post.slug) === index,
  );
  const viewCountMap = new Map<string, number>();

  if (process.env.DATABASE_URL && deduped.length > 0) {
    try {
      const views = await prisma.postView.findMany({
        where: { slug: { in: deduped.map((post) => post.slug) } },
        select: { slug: true, viewCount: true },
      });
      views.forEach((row) => {
        viewCountMap.set(row.slug, row.viewCount);
      });
    } catch {
      // Ignore read errors so post rendering still works.
    }
  }

  const withViews = deduped.map((post) => ({
    ...post,
    viewCount: viewCountMap.get(post.slug) ?? 0,
  }));
  const filtered = includeDraft ? withViews : withViews.filter((post) => post.isPublished);
  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts(true);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getCategories() {
  const posts = await getAllPosts();
  return [...new Set(posts.map((post) => post.category))];
}

export async function getTags() {
  const posts = await getAllPosts();
  return [...new Set(posts.flatMap((post) => post.tags))];
}

export async function createDraftPost(input: {
  keywordId: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  category: string;
  tags: string[];
  postType: string;
}) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for draft generation");
  }

  return prisma.post.create({
    data: {
      keywordId: input.keywordId,
      slug: `${slugify(input.title)}-${Date.now()}`,
      title: input.title,
      excerpt: input.excerpt,
      contentMdx: input.contentMdx,
      category: input.category,
      tags: input.tags,
      postType: input.postType,
      seoTitle: input.title,
      metaDescription: input.excerpt,
      isPublished: false,
    },
  });
}

export function buildDraftTemplate(input: {
  keyword: string;
  postType: string;
  outline: string[];
  recommendedCTA?: string | null;
  parsedSources?: ParsedSource[];
}) {
  const primaryImage =
    input.parsedSources?.find((source) => source.image)?.image ??
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=80";

  const sourceSummarySection =
    input.parsedSources && input.parsedSources.length > 0
      ? [
          "## 참고 기사 핵심 요약",
          "",
          ...input.parsedSources.slice(0, 5).flatMap((source, index) => [
            `### ${index + 1}. ${source.title}`,
            "",
            `- 출처: ${source.siteName ?? "외부 매체"} (${source.finalUrl})`,
            `- 요약: ${(source.description || source.contentText).slice(0, 240)}`,
            source.publishedAt ? `- 발행일: ${source.publishedAt}` : "",
            "",
          ]),
        ]
      : [];

  const sections = input.outline
    .map(
      (section, index) =>
        `## ${index + 1}. ${section}\n\n${input.keyword}를 실무에 적용할 때 필요한 핵심 포인트를 정리합니다.`,
    )
    .join("\n\n");

  return [
    `# ${input.keyword} 실무 가이드`,
    "",
    `> 이 글은 ${input.keyword} 키워드 기반 콘텐츠 브리프를 바탕으로 작성된 초안입니다.`,
    "",
    `![이슈 관련 대표 이미지](${primaryImage})`,
    "*이미지 출처: Unsplash / 라이선스 확인 후 사용*",
    "",
    ...sourceSummarySection,
    ...(sourceSummarySection.length > 0 ? [""] : []),
    sections,
    "",
    `## CTA`,
    "",
    `<CTABox title="관련 이슈 더 보기" description="${
      input.recommendedCTA ?? "동일 주제의 시사 이슈 브리프를 이어서 확인해보세요."
    }" href="/blog" />`,
    "",
    "## 참고 기사/자료",
    "",
    "- [기사 제목 1](https://example.com)",
    "- [기사 제목 2](https://example.com)",
    "- [공식 보고서](https://example.com)",
    "",
    "<ImageCreditList",
    "  items={[",
    "    { label: \"대표 이미지\", source: \"https://example.com/image-source\" },",
    "  ]}",
    "/>",
    "",
    "> 참고: 기사 원문을 그대로 복사하지 말고, 핵심 사실을 재서술하고 출처 링크를 남겨주세요.",
    "",
    "## FAQ",
    "",
    "- Q: 가장 먼저 해야 할 일은?",
    "- A: 현업 기준으로 체크리스트를 먼저 정리한 뒤 단계별로 실행하세요.",
  ].join("\n");
}
