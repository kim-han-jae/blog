import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActions } from "@/components/admin/admin-actions";
import { getAdminSnapshot } from "@/lib/db";

export default async function AdminDashboardPage() {
  const snapshot = await getAdminSnapshot();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-zinc-600">키워드 → 브리프 → 초안 → 발행 워크플로우를 관리합니다.</p>
      </div>

      <AdminActions />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>키워드</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{snapshot.keywordCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>브리프</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{snapshot.briefCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>포스트</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{snapshot.postCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>발행</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{snapshot.publishedCount}</CardContent>
        </Card>
      </div>
    </section>
  );
}
