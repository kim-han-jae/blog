import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UnifiedPost } from "@/types/post";

function formatViewCount(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function PostCard({ post }: { post: UnifiedPost }) {
  return (
    <Card className="h-full overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail ?? "/thumbnails/issue-default.svg"}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          <Badge>{post.category}</Badge>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default">
              #{tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <p>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ko-KR") : "-"}</p>
          <p>조회수 {formatViewCount(post.viewCount)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
