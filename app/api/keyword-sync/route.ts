import { keywordSyncSchema, syncKeywords } from "@/lib/keywords";
import { errorResponse, successResponse } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const parsed = keywordSyncSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(parsed.error.flatten().formErrors.join(", ") || "Invalid payload");
    }

    const keywords = await syncKeywords(parsed.data.keywords);
    return successResponse({
      count: keywords.length,
      items: keywords.map((item) => ({
        id: item.id,
        keyword: item.keyword,
        status: item.status,
      })),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Keyword sync failed", 500);
  }
}
