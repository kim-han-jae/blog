import { BriefStatus, KeywordStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildDraftTemplate, createDraftPost } from "@/lib/posts";
import { toPlainArray } from "@/lib/utils";
import { errorResponse, successResponse } from "@/lib/api";

const payloadSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});

function inferPostType(keyword: string) {
  if (keyword.includes("추천")) return "AFFILIATE";
  if (keyword.includes("비교")) return "COMPARISON";
  return "INFORMATIONAL";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(parsed.error.flatten().formErrors.join(", ") || "Invalid payload");
    }

    const briefs = await prisma.contentBrief.findMany({
      where: { status: BriefStatus.APPROVED },
      include: { keyword: true },
      orderBy: { updatedAt: "desc" },
      take: parsed.data.limit ?? 5,
    });

    const created = [];

    for (const brief of briefs) {
      const existingPost = await prisma.post.findFirst({
        where: { keywordId: brief.keywordId },
      });
      if (existingPost) continue;

      const outline = toPlainArray(brief.outline);
      const postType = inferPostType(brief.keyword.keyword);
      const contentMdx = buildDraftTemplate({
        keyword: brief.keyword.keyword,
        postType,
        outline,
        recommendedCTA: brief.recommendedCTA,
      });

      const post = await createDraftPost({
        keywordId: brief.keywordId,
        title: brief.workingTitle,
        excerpt: `${brief.keyword.keyword}를 실무에 적용하기 위한 단계별 가이드`,
        contentMdx,
        category: brief.keyword.category,
        tags: [brief.keyword.keyword, brief.keyword.category, "시사브리프"],
        postType,
      });

      await prisma.keyword.update({
        where: { id: brief.keywordId },
        data: { status: KeywordStatus.DRAFTED },
      });

      created.push(post);
    }

    return successResponse({
      count: created.length,
      items: created.map((item) => ({ id: item.id, title: item.title })),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Draft generation failed", 500);
  }
}
