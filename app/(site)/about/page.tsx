import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "최근 이슈 기반 콘텐츠 운영 도구 소개",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="prose-content max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">About</h1>
      <p>
        이 프로젝트는 최근 시사 이슈 키워드를 빠르게 콘텐츠화하면서 품질을 유지하기 위한 운영 도구입니다.
      </p>
      <p>완전 자동 생성이 아닌 브리프 기반 + 수동 검수 워크플로우를 핵심 원칙으로 설계했습니다.</p>
    </article>
  );
}
