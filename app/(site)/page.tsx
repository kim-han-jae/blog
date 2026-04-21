import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { AdPlaceholder } from "@/components/cta/ad-placeholder";

export const metadata = buildMetadata({
  title: "최근 시사 이슈 블로그",
  description:
    "정책, 경제, 사회, 기술, 국제 분야의 최근 시사 이슈를 브리프 형식으로 정리한 블로그",
  path: "/",
});

export default async function HomePage() {
  const posts = await getAllPosts();
  const featuredPost = posts[0];

  return (
    <div className="space-y-10">
      {featuredPost && (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <p className="text-sm font-medium text-zinc-600">오늘의 주요 이슈</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{featuredPost.title}</h1>
          <p className="mt-4 max-w-3xl text-zinc-600">{featuredPost.excerpt}</p>
          <div className="mt-6">
            <Link href={`/blog/${featuredPost.slug}`} className="text-sm font-semibold">
              자세히 읽기 →
            </Link>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">최신 포스트</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <AdPlaceholder label="홈 하단 광고" slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HOME} />
    </div>
  );
}
