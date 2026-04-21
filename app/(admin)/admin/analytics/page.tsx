import { prisma } from "@/lib/prisma";
import { getAnalyticsSummary } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminAnalyticsPage() {
  const [summary, rows] = await Promise.all([
    getAnalyticsSummary(),
    process.env.DATABASE_URL
      ? prisma.postAnalytics.findMany({
          include: { post: true },
          orderBy: { updatedAt: "desc" },
          take: 10,
        })
      : Promise.resolve([]),
  ]);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">성과 분석</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Impressions</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalImpressions}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clicks</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalClicks}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CTR</CardTitle>
          </CardHeader>
          <CardContent>{summary.averageCtr}%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PageViews</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalPageViews}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CTA Clicks</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalCtaClicks}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 동기화 데이터</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>포스트</TableHead>
                <TableHead>노출</TableHead>
                <TableHead>클릭</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>평균순위</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.post.title}</TableCell>
                  <TableCell>{row.impressions}</TableCell>
                  <TableCell>{row.clicks}</TableCell>
                  <TableCell>{row.ctr}%</TableCell>
                  <TableCell>{row.avgPosition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
