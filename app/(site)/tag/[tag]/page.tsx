import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/ui/empty-state";

type Params = { tag: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  return buildMetadata({
    title: `태그: ${tag}`,
    description: `${tag} 태그 포스트 모음`,
    path: `/tag/${tag}`,
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const posts = (await getAllPosts()).filter((post) => post.tags.includes(tag));

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">태그: #{tag}</h1>
      {posts.length === 0 ? (
        <EmptyState title="태그 포스트가 없습니다." description="다른 태그를 탐색해보세요." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
