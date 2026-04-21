import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "개인정보 처리방침",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="prose-content max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>본 사이트는 서비스 운영 및 통계 분석을 위해 최소한의 로그 데이터를 수집할 수 있습니다.</p>
      <p>수집 데이터는 서비스 개선 목적 외로 사용하지 않으며, 외부 공유 시 익명화 처리됩니다.</p>
    </article>
  );
}
