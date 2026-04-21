import { syncAnalytics } from "@/lib/analytics";
import { errorResponse, successResponse } from "@/lib/api";

export async function POST() {
  try {
    const rows = await syncAnalytics();
    return successResponse({
      count: rows.length,
      items: rows.map((item) => ({
        id: item.id,
        postId: item.postId,
        impressions: item.impressions,
      })),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Analytics sync failed", 500);
  }
}
