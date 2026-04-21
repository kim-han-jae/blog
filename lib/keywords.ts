import { KeywordStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const seedKeywords = [
  "2026 기준금리 인하 전망 정리",
  "총선 이후 부동산 정책 변화",
  "AI 규제법 최신 동향",
  "글로벌 공급망 리스크 최근 이슈",
  "전기요금 인상 영향 분석",
  "고용시장 구조 변화 트렌드",
  "청년 주거 지원 정책 비교",
  "공공요금 상승 대응 체크리스트",
  "중동 정세 불안 경제 영향",
  "데이터 프라이버시 이슈 정리",
] as const;

export const keywordSyncSchema = z.object({
  keywords: z.array(z.string().min(1)).optional(),
});

function classifyCategory(keyword: string) {
  if (keyword.includes("정책") || keyword.includes("규제")) return "정책";
  if (keyword.includes("금리") || keyword.includes("요금") || keyword.includes("경제")) return "경제";
  if (keyword.includes("고용") || keyword.includes("주거") || keyword.includes("청년")) return "사회";
  if (keyword.includes("AI") || keyword.includes("데이터")) return "기술";
  if (keyword.includes("정세") || keyword.includes("글로벌")) return "국제";
  return "시사";
}

function classifyIntent(keyword: string) {
  if (keyword.includes("정리") || keyword.includes("동향") || keyword.includes("분석")) return "INFORMATIONAL";
  if (keyword.includes("비교") || keyword.includes("체크리스트") || keyword.includes("대응")) return "COMMERCIAL";
  return "NAVIGATIONAL";
}

export function calculatePriorityScore(input: {
  topicRelevanceScore: number;
  competitionScore: number;
  seasonalityScore: number;
}) {
  return (
    input.topicRelevanceScore * 0.55 +
    (10 - input.competitionScore) * 0.3 +
    input.seasonalityScore * 0.15
  );
}

export function buildKeywordCreateInput(keyword: string): Prisma.KeywordCreateInput {
  const topicRelevanceScore = Math.min(10, 5 + Math.floor(Math.random() * 5));
  const competitionScore = Math.min(10, 3 + Math.floor(Math.random() * 6));
  const seasonalityScore = 3 + Math.floor(Math.random() * 7);
  const priorityScore = calculatePriorityScore({
    topicRelevanceScore,
    competitionScore,
    seasonalityScore,
  });

  return {
    keyword,
    cluster: "current-affairs-recent-issues",
    category: classifyCategory(keyword),
    searchIntent: classifyIntent(keyword),
    topicRelevanceScore,
    competitionScore,
    seasonalityScore,
    priorityScore,
    status: KeywordStatus.NEW,
  };
}

export async function syncKeywords(rawKeywords?: string[]) {
  const keywords = rawKeywords?.length ? rawKeywords : [...seedKeywords];
  const normalized = [...new Set(keywords.map((value) => value.trim()).filter(Boolean))];

  const operations = normalized.map((keyword) =>
    prisma.keyword.upsert({
      where: { keyword },
      update: {
        category: classifyCategory(keyword),
        searchIntent: classifyIntent(keyword),
      },
      create: buildKeywordCreateInput(keyword),
    }),
  );

  return Promise.all(operations);
}
