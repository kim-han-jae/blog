import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "광고 및 제휴 고지",
  description: "광고/제휴 링크 운영 원칙과 편집 기준 안내",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <article className="prose-content max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">광고 및 제휴 고지</h1>
      <p>
        이 사이트는 일부 페이지에서 Google AdSense 광고를 표시할 수 있으며, 특정 콘텐츠에는 제휴 링크가 포함될 수 있습니다.
      </p>
      <p>
        제휴 링크를 통해 수익이 발생하더라도 편집 방향, 주제 선정, 평가 기준은 독립적으로 유지하며, 유료 게재 콘텐츠는
        별도 표기를 원칙으로 합니다.
      </p>
      <h2 className="text-xl font-semibold">운영 원칙</h2>
      <ul className="list-disc pl-5">
        <li>사실 확인이 어려운 정보는 광고/제휴 목적이라도 게시하지 않습니다.</li>
        <li>협찬 또는 대가성 콘텐츠는 본문 상단에 명확히 고지합니다.</li>
        <li>독자에게 불리한 과장 표현, 허위 비교, 오해 소지가 있는 문구를 지양합니다.</li>
      </ul>
      <p className="text-sm text-zinc-500">최종 업데이트: {new Date().toLocaleDateString("ko-KR")}</p>
    </article>
  );
}
