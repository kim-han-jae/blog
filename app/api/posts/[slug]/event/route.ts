import { errorResponse, successResponse } from "@/lib/api";
import { incrementPostEventBySlug } from "@/lib/analytics";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type EventPayload = {
  eventType?: "cta" | "affiliate";
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug) {
    return errorResponse("Invalid slug", 400);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as EventPayload;
    const eventType = body.eventType === "affiliate" ? "affiliate" : "cta";
    const result = await incrementPostEventBySlug(slug, eventType);
    return successResponse(result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to track event", 500);
  }
}
