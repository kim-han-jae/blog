import { PrismaClient } from "@prisma/client";
import { buildKeywordCreateInput, seedKeywords } from "../lib/keywords";

const prisma = new PrismaClient();

async function main() {
  for (const keyword of seedKeywords) {
    await prisma.keyword.upsert({
      where: { keyword },
      update: {
        category: buildKeywordCreateInput(keyword).category,
        searchIntent: buildKeywordCreateInput(keyword).searchIntent,
      },
      create: buildKeywordCreateInput(keyword),
    });
  }

  // 샘플 브리프 1건을 기본 생성해 관리자 화면 진입 시 데이터 확인이 가능하도록 합니다.
  const firstKeyword = await prisma.keyword.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (firstKeyword) {
    await prisma.contentBrief.upsert({
      where: { keywordId: firstKeyword.id },
      update: {},
      create: {
        keywordId: firstKeyword.id,
        workingTitle: `${firstKeyword.keyword} 이슈 브리프`,
        targetReader: "최근 시사 이슈를 빠르게 파악하려는 일반 독자 및 실무자",
        primaryQuestion: "이 이슈의 핵심 쟁점과 파급효과는 무엇인가?",
        secondaryQuestions: ["단기적으로 확인할 포인트는?", "관련 정책/지표는 무엇인가?"],
        outline: ["이슈 배경", "영향 분석", "실행 우선순위", "FAQ"],
        requiredExamples: ["최근 뉴스 요약", "쟁점 비교", "체크리스트"],
        recommendedCTA: "관련 이슈 브리프 더 보기",
        affiliatePossible: false,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
