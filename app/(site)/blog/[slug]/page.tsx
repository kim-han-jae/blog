import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { renderMdx } from "@/lib/mdx";
import { buildCanonical, buildMetadata, seoConfig } from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getRelatedPosts } from "@/lib/internal-links";
import { createArticleSchema, createBreadcrumbSchema, createFaqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { TableOfContents } from "@/components/blog/toc";
import { FaqList } from "@/components/blog/faq-list";
import { AdPlaceholder } from "@/components/cta/ad-placeholder";
import { CTABox } from "@/components/cta/cta-box";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";

type Params = { slug: string };

function extractHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim());
}

function normalizeFaq(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is { question: string; answer: string } =>
        !!item && typeof item === "object" && "question" in item && "answer" in item,
    )
    .map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category],
    openGraphType: "article",
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.isPublished) {
    notFound();
  }

  const content = await renderMdx(post.contentMdx);
  const headings = extractHeadings(post.contentMdx);
  const allPosts = await getAllPosts();
  const relatedPosts = getRelatedPosts(post, allPosts, 3);
  const faqs = normalizeFaq(post.faqJson);

  const canonical = buildCanonical(`/blog/${post.slug}`);
  const articleSchema = createArticleSchema({
    url: canonical,
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt?.toISOString(),
    updatedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    image: `${seoConfig.siteUrl}/opengraph-image`,
    category: post.category,
    tags: post.tags,
    authorName: seoConfig.defaultAuthor,
    publisherName: seoConfig.siteName,
    publisherLogo: `${seoConfig.siteUrl}/logo-issueisshu.svg`,
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "홈", url: seoConfig.siteUrl },
    { name: "블로그", url: `${seoConfig.siteUrl}/blog` },
    { name: post.title, url: canonical },
  ]);

  return (
    <article className="space-y-8">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqs.length > 0 && <JsonLd data={createFaqSchema(faqs)} />}

      <Breadcrumbs
        items={[
          { label: "홈", href: "/" },
          { label: "블로그", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{post.category}</Badge>
          {post.tags.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-zinc-600">{post.excerpt}</p>
        <p className="text-sm text-zinc-500">
          작성일: {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="prose-content">{content}</div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <TableOfContents headings={headings} />
          <CTABox
            title="관련 시사 이슈 더 보기"
            description="정책, 경제, 국제 이슈를 브리프 형태로 빠르게 탐색해보세요."
            href="/blog"
          />
        </div>
      </div>

      <FaqList items={faqs} />
      <AdPlaceholder label="본문 하단 광고" slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_IN_ARTICLE} />

      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">관련 글</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <PostCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
