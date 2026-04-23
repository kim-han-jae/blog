import { BriefStatus, KeywordStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildDraftTemplate, createDraftPost } from "@/lib/posts";
import { toPlainArray } from "@/lib/utils";
import { errorResponse, successResponse } from "@/lib/api";
import { parseSourceUrls } from "@/lib/source-parser";
import { discoverArticleUrlsByKeyword } from "@/lib/source-discovery";

const payloadSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
  sourceUrls: z.array(z.string().url()).max(20).optional(),
  sourceKeyword: z.string().min(1).max(120).optional(),
  koreanLimit: z.number().int().min(1).max(10).optional(),
  globalLimit: z.number().int().min(0).max(10).optional(),
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

    const discovered = !parsed.data.sourceUrls?.length && parsed.data.sourceKeyword
      ? await discoverArticleUrlsByKeyword({
          keyword: parsed.data.sourceKeyword,
          koreanLimit: parsed.data.koreanLimit,
          globalLimit: parsed.data.globalLimit,
        })
      : null;

    const sourceUrls = parsed.data.sourceUrls?.length
      ? parsed.data.sourceUrls
      : (discovered?.urls ?? []);

    const parsedSources = sourceUrls.length ? await parseSourceUrls(sourceUrls) : null;

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
        parsedSources: parsedSources?.items,
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
      sourceCount: parsedSources?.items.length ?? 0,
      sourceFailedCount: parsedSources?.failed.length ?? 0,
      sourceKeyword: parsed.data.sourceKeyword ?? null,
      discoveredKoreanCount: discovered?.koreanUrls.length ?? 0,
      discoveredGlobalCount: discovered?.globalUrls.length ?? 0,
      items: created.map((item) => ({ id: item.id, title: item.title })),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Draft generation failed", 500);
  }
}
