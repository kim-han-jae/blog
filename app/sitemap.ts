import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { seoConfig } from "@/lib/seo";

function buildUrl(pathname: string) {
  return new URL(pathname, seoConfig.siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/privacy", "/disclosure", "/contact", "/blog", "/search"];
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: buildUrl(path || "/"),
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const posts = await getAllPosts();
    const categories = [...new Set(posts.map((post) => post.category))];
    const tags = [...new Set(posts.flatMap((post) => post.tags))];

    return [
      ...staticEntries,
      ...posts.map((post) => ({
        url: buildUrl(`/blog/${encodeURIComponent(post.slug)}`),
        lastModified: post.publishedAt ?? post.createdAt ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...categories.map((category) => ({
        url: buildUrl(`/category/${encodeURIComponent(category)}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...tags.map((tag) => ({
        url: buildUrl(`/tag/${encodeURIComponent(tag)}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // Prevent a full sitemap failure when data sources are temporarily unavailable.
    return staticEntries.map((entry) => ({
      ...entry,
      changeFrequency: "daily" as const,
    }));
  }
}
