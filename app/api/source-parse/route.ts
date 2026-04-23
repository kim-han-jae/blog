import { z } from "zod";
import { parseSourceUrls } from "@/lib/source-parser";
import { discoverArticleUrlsByKeyword } from "@/lib/source-discovery";
import { errorResponse, successResponse } from "@/lib/api";

const payloadSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(20).optional(),
  keyword: z.string().min(1).max(120).optional(),
  koreanLimit: z.number().int().min(1).max(10).optional(),
  globalLimit: z.number().int().min(0).max(10).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(parsed.error.flatten().formErrors.join(", ") || "Invalid payload");
    }

    if (!parsed.data.urls?.length && !parsed.data.keyword) {
      return errorResponse("Either urls or keyword is required");
    }

    const discovered = parsed.data.keyword
      ? await discoverArticleUrlsByKeyword({
          keyword: parsed.data.keyword,
          koreanLimit: parsed.data.koreanLimit,
          globalLimit: parsed.data.globalLimit,
        })
      : null;

    const targetUrls = parsed.data.urls?.length ? parsed.data.urls : (discovered?.urls ?? []);
    const result = await parseSourceUrls(targetUrls);

    return successResponse({
      count: result.items.length,
      items: result.items,
      keyword: parsed.data.keyword ?? null,
      discoveredUrls: discovered?.urls ?? [],
      discoveredKoreanCount: discovered?.koreanUrls.length ?? 0,
      discoveredGlobalCount: discovered?.globalUrls.length ?? 0,
      koreanCandidateCount: result.koreanCandidateCount,
      globalCandidateCount: result.globalCandidateCount,
      koreanFirstApplied: result.koreanFirstApplied,
      invalidUrls: result.invalidUrls,
      failed: result.failed,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Source parsing failed", 500);
  }
}
