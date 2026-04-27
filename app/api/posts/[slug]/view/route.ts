import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  if (!process.env.DATABASE_URL) {
    return successResponse({ viewCount: 0, tracked: false });
  }

  const { slug } = await context.params;
  if (!slug) {
    return errorResponse("Invalid slug", 400);
  }

  try {
    const row = await prisma.postView.upsert({
      where: { slug },
      update: {
        viewCount: {
          increment: 1,
        },
      },
      create: {
        slug,
        viewCount: 1,
      },
      select: {
        viewCount: true,
      },
    });

    return successResponse({ viewCount: row.viewCount, tracked: true });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update post view", 500);
  }
}
