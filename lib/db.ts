import { prisma } from "@/lib/prisma";

export async function getAdminSnapshot() {
  if (!process.env.DATABASE_URL) {
    return {
      keywordCount: 0,
      briefCount: 0,
      postCount: 0,
      publishedCount: 0,
    };
  }

  const [keywordCount, briefCount, postCount, publishedCount] = await Promise.all([
    prisma.keyword.count(),
    prisma.contentBrief.count(),
    prisma.post.count(),
    prisma.post.count({ where: { isPublished: true } }),
  ]);

  return {
    keywordCount,
    briefCount,
    postCount,
    publishedCount,
  };
}
