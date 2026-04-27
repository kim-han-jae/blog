import type { Post } from "@prisma/client";

export type PostItem = Post;

export type UnifiedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  thumbnail?: string | null;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  source: "db" | "file";
  seoTitle?: string | null;
  metaDescription?: string | null;
  faqJson?: unknown;
  viewCount: number;
};
