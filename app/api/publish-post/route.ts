import { KeywordStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { getAllPosts } from "@/lib/posts";
import { getRelatedPosts } from "@/lib/internal-links";
import { errorResponse, successResponse } from "@/lib/api";
import { validatePublishSources } from "@/lib/sources";

const payloadSchema = z.object({
  postId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(parsed.error.flatten().formErrors.join(", ") || "Invalid payload");
    }

    const target = await prisma.post.findUnique({
      where: { id: parsed.data.postId },
    });
    if (!target) return errorResponse("Post not found", 404);

    const sourceCheck = validatePublishSources(target.contentMdx);
    if (!sourceCheck.pass) {
      return errorResponse(
        [
          "출처 검증에 실패했습니다.",
          `유효한 참고 링크 수: ${sourceCheck.validSourceCount}개 (최소 2개 필요)`,
          sourceCheck.invalidSources.length
            ? `유효하지 않은 링크: ${sourceCheck.invalidSources.join(", ")}`
            : "",
          sourceCheck.hasImage && !sourceCheck.hasImageCredit
            ? "이미지가 포함된 경우 '이미지 출처' 표기가 필요합니다."
            : "",
        ]
          .filter(Boolean)
          .join(" "),
        400,
      );
    }

    const timestamp = Date.now();
    const published = await prisma.post.update({
      where: { id: target.id },
      data: {
        slug: `${slugify(target.title)}-${timestamp}`,
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    if (published.keywordId) {
      await prisma.keyword.update({
        where: { id: published.keywordId },
        data: { status: KeywordStatus.PUBLISHED },
      });
    }

    const posts = await getAllPosts();
    const unified = posts.find((item) => item.slug === published.slug);
    const related = unified ? getRelatedPosts(unified, posts, 3) : [];

    await prisma.post.update({
      where: { id: published.id },
      data: {
        schemaJson: {
          relatedSlugs: related.map((post) => post.slug),
        },
      },
    });

    return successResponse({
      id: published.id,
      slug: published.slug,
      relatedSlugs: related.map((post) => post.slug),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Publish failed", 500);
  }
}
