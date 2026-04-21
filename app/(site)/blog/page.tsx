import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { createCollectionPageSchema } from "@/lib/schema";
import { buildCanonical } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "블로그",
  description: "카테고리별 실무 콘텐츠 목록",
  path: "/blog",
});

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag = "" } = await searchParams;
  const posts = await getAllPosts();
  const allTags = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const filteredPosts = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;
  const collectionSchema = createCollectionPageSchema({
    name: tag ? `블로그 - 태그 ${tag}` : "블로그",
    url: buildCanonical(tag ? `/blog?tag=${encodeURIComponent(tag)}` : "/blog"),
    description: "카테고리별 실무 콘텐츠 목록",
    items: filteredPosts.map((post) => ({
      name: post.title,
      url: buildCanonical(`/blog/${post.slug}`),
    })),
  });

  return (
    <section className="space-y-6">
      <JsonLd data={collectionSchema} />
      <div>
        <h1 className="text-3xl font-bold">블로그</h1>
        <p className="mt-2 text-zinc-600">태그 칩을 눌러 관련 콘텐츠만 모아볼 수 있습니다.</p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              tag ? "border-zinc-300 bg-white text-zinc-700" : "border-zinc-900 bg-zinc-900 text-white",
            )}
          >
            전체
          </Link>
          {allTags.map((item) => (
            <Link
              key={item}
              href={`/blog?tag=${encodeURIComponent(item)}`}
              className={cn(
                "rounded-full border px-3 py-1 text-sm",
                tag === item
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700",
              )}
            >
              #{item}
            </Link>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <EmptyState title="포스트가 없습니다." description="곧 새로운 시사 이슈 콘텐츠가 올라옵니다." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
