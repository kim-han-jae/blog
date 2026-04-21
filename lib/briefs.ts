import { BriefStatus, KeywordStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function inferPostType(keyword: string) {
  if (keyword.includes("추천")) return "AFFILIATE";
  if (keyword.includes("비교")) return "COMPARISON";
  return "INFORMATIONAL";
}

export function buildOutline(keyword: string) {
  const postType = inferPostType(keyword);

  if (postType === "AFFILIATE") {
    return [
      "제품이 필요한 상황",
      "선택 기준",
      "추천 포인트",
      "구매 전 체크리스트",
      "CTA 또는 제휴 링크 위치",
    ];
  }

  if (postType === "COMPARISON") {
    return [
      "상황 정의",
      "비교 기준",
      "옵션별 장단점",
      "추천 대상",
      "실무 팁",
      "CTA",
    ];
  }

  return [
    "문제 정의",
    "왜 중요한가",
    "기본 개념",
    "실무 적용 방법",
    "체크리스트",
    "자주 하는 실수",
    "참고 기사/자료 요약",
    "이미지 및 출처 표기",
    "관련 자료 CTA",
    "FAQ",
  ];
}

export async function generateBriefs(limit = 5) {
  const targetKeywords = await prisma.keyword.findMany({
    where: { status: KeywordStatus.NEW },
    orderBy: { priorityScore: "desc" },
    take: limit,
  });

  const results = [];

  for (const keyword of targetKeywords) {
    const outline = buildOutline(keyword.keyword);
    const brief = await prisma.contentBrief.upsert({
      where: { keywordId: keyword.id },
      update: {
        workingTitle: `${keyword.keyword} 실무 가이드`,
        targetReader: "최근 시사 이슈를 빠르게 파악하려는 실무자와 일반 독자",
        primaryQuestion: `${keyword.keyword}, 실제로 어떻게 시작해야 하나요?`,
        secondaryQuestions: [
          `${keyword.keyword}에서 가장 많이 실수하는 부분은?`,
          "핵심 쟁점과 체크포인트는 무엇인가?",
        ],
        outline,
        requiredExamples: [
          "최근 뉴스 2~3개 핵심 요약",
          "쟁점 비교표",
          "출처 표기된 대표 이미지",
          "체크리스트 예시",
        ],
        recommendedCTA: "관련 이슈 브리프 모아보기",
        affiliatePossible: keyword.keyword.includes("추천"),
        status: BriefStatus.PENDING,
      },
      create: {
        keywordId: keyword.id,
        workingTitle: `${keyword.keyword} 실무 가이드`,
        targetReader: "최근 시사 이슈를 빠르게 파악하려는 실무자와 일반 독자",
        primaryQuestion: `${keyword.keyword}, 실제로 어떻게 시작해야 하나요?`,
        secondaryQuestions: [
          `${keyword.keyword}에서 가장 많이 실수하는 부분은?`,
          "핵심 쟁점과 체크포인트는 무엇인가?",
        ],
        outline,
        requiredExamples: [
          "최근 뉴스 2~3개 핵심 요약",
          "쟁점 비교표",
          "출처 표기된 대표 이미지",
          "체크리스트 예시",
        ],
        recommendedCTA: "관련 이슈 브리프 모아보기",
        affiliatePossible: keyword.keyword.includes("추천"),
        status: BriefStatus.PENDING,
      },
    });

    await prisma.keyword.update({
      where: { id: keyword.id },
      data: { status: KeywordStatus.BRIEFED },
    });

    results.push(brief);
  }

  return results;
}
