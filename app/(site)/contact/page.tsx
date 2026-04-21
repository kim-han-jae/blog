import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "문의 안내",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <article className="prose-content max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p>협업 또는 문의는 아래 이메일로 연락해주세요.</p>
      <p className="font-medium">contact@currentaffairs.example</p>
    </article>
  );
}
