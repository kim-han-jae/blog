import type { PostAnalytics } from "@prisma/client";

export type AnalyticsItem = PostAnalytics;

export type AnalyticsSummary = {
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  totalPageViews: number;
  totalAffiliateClicks: number;
  totalCtaClicks: number;
};
