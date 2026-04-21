import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/posts";
import { seoConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([getAllPosts(), getCategories(), getTags()]);

  const staticRoutes = ["", "/about", "/privacy", "/contact", "/blog", "/search"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${seoConfig.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${seoConfig.siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ?? post.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${seoConfig.siteUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: `${seoConfig.siteUrl}/tag/${tag}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
