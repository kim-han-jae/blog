import { getAllPosts } from "@/lib/posts";
import { seoConfig } from "@/lib/seo";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${seoConfig.siteUrl}/blog/${post.slug}`;
      const pubDate = (post.publishedAt ?? post.createdAt).toUTCString();
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<description>${escapeXml(post.excerpt)}</description>`,
        `<pubDate>${pubDate}</pubDate>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${escapeXml(seoConfig.siteName)}</title>`,
    `<link>${seoConfig.siteUrl}</link>`,
    `<description>${escapeXml(seoConfig.defaultDescription)}</description>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
