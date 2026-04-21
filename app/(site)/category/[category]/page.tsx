import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/ui/empty-state";

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  return buildMetadata({
    title: `${category} 카테고리`,
    description: `${category} 관련 포스트 목록`,
    path: `/category/${category}`,
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];
  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const posts = (await getAllPosts()).filter((post) => post.category === category);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">카테고리: {category}</h1>
      {posts.length === 0 ? (
        <EmptyState title="카테고리 포스트가 없습니다." description="다른 카테고리를 탐색해보세요." />
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
