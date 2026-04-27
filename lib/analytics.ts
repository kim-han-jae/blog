import { prisma } from "@/lib/prisma";
import type { AnalyticsSummary } from "@/types/analytics";

export interface AnalyticsProvider {
  fetchPostMetrics(postUrl: string): Promise<{
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
    pageViews: number;
    affiliateClicks: number;
    ctaClicks: number;
  }>;
}

export async function syncAnalytics() {
  if (!process.env.DATABASE_URL) return [];

  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { id: true },
  });

  const updates = posts.map((post) => {
    const impressions = Math.floor(Math.random() * 5000) + 100;
    const clicks = Math.floor(impressions * (Math.random() * 0.12));
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

    return prisma.postAnalytics.upsert({
      where: { postId: post.id },
      update: {
        impressions,
        clicks,
        ctr,
        avgPosition: Number((Math.random() * 20).toFixed(1)),
        pageViews: Math.floor(Math.random() * 2000) + 50,
        affiliateClicks: Math.floor(Math.random() * 300),
        ctaClicks: Math.floor(Math.random() * 300),
      },
      create: {
        postId: post.id,
        impressions,
        clicks,
        ctr,
        avgPosition: Number((Math.random() * 20).toFixed(1)),
        pageViews: Math.floor(Math.random() * 2000) + 50,
        affiliateClicks: Math.floor(Math.random() * 300),
        ctaClicks: Math.floor(Math.random() * 300),
      },
    });
  });

  return Promise.all(updates);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!process.env.DATABASE_URL) {
    return {
      totalImpressions: 0,
      totalClicks: 0,
      averageCtr: 0,
      totalPageViews: 0,
      totalAffiliateClicks: 0,
      totalCtaClicks: 0,
    };
  }

  const rows = await prisma.postAnalytics.findMany();
  const total = rows.reduce(
    (acc, row) => {
      acc.totalImpressions += row.impressions;
      acc.totalClicks += row.clicks;
      acc.totalPageViews += row.pageViews;
      acc.totalAffiliateClicks += row.affiliateClicks;
      acc.totalCtaClicks += row.ctaClicks;
      return acc;
    },
    {
      totalImpressions: 0,
      totalClicks: 0,
      totalPageViews: 0,
      totalAffiliateClicks: 0,
      totalCtaClicks: 0,
    },
  );

  return {
    ...total,
    averageCtr:
      total.totalImpressions === 0
        ? 0
        : Number(((total.totalClicks / total.totalImpressions) * 100).toFixed(2)),
  };
}

export async function incrementPostEventBySlug(
  slug: string,
  eventType: "cta" | "affiliate",
) {
  if (!process.env.DATABASE_URL) {
    return { tracked: false, ctaClicks: 0, affiliateClicks: 0 };
  }

  const update =
    eventType === "affiliate"
      ? {
          affiliateClicks: {
            increment: 1,
          },
        }
      : {
          ctaClicks: {
            increment: 1,
          },
        };

  const row = await prisma.postView.upsert({
    where: { slug },
    update,
    create: {
      slug,
      viewCount: 0,
      ctaClicks: eventType === "cta" ? 1 : 0,
      affiliateClicks: eventType === "affiliate" ? 1 : 0,
    },
    select: {
      ctaClicks: true,
      affiliateClicks: true,
    },
  });

  return {
    tracked: true,
    ctaClicks: row.ctaClicks,
    affiliateClicks: row.affiliateClicks,
  };
}
