import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = buildMetadata({
  title: "검색",
  description: "포스트 검색",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const posts = await getAllPosts();
  const filtered = query
    ? posts.filter((post) => {
        const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
    : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">검색</h1>
      <form className="max-w-xl">
        <Input name="q" defaultValue={q} placeholder="키워드, 태그, 제목으로 검색" />
      </form>
      {query.length === 0 ? (
        <EmptyState title="검색어를 입력하세요." description="예: 작업지시서 작성법" />
      ) : filtered.length === 0 ? (
        <EmptyState title="검색 결과가 없습니다." description="다른 검색어를 입력해보세요." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
