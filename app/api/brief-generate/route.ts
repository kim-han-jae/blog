import { z } from "zod";
import { generateBriefs } from "@/lib/briefs";
import { errorResponse, successResponse } from "@/lib/api";

const payloadSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(parsed.error.flatten().formErrors.join(", ") || "Invalid payload");
    }

    const briefs = await generateBriefs(parsed.data.limit ?? 5);
    return successResponse({
      count: briefs.length,
      items: briefs.map((brief) => ({ id: brief.id, status: brief.status })),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Brief generation failed", 500);
  }
}
