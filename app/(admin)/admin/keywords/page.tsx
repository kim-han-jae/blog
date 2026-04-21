import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";

const statusOptions = ["", "NEW", "BRIEFED", "DRAFTED", "REVIEWED", "PUBLISHED", "ARCHIVED"];

export default async function AdminKeywordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;

  const keywords = process.env.DATABASE_URL
    ? await prisma.keyword.findMany({
        where: {
          keyword: q ? { contains: q, mode: "insensitive" } : undefined,
          status: status ? (status as never) : undefined,
        },
        orderBy: { priorityScore: "desc" },
      })
    : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">키워드 관리</h1>
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-4">
            <Input name="q" placeholder="키워드 검색" defaultValue={q} />
            <Select name="status" defaultValue={status}>
              {statusOptions.map((option) => (
                <option key={option || "all"} value={option}>
                  {option || "전체 상태"}
                </option>
              ))}
            </Select>
            <Button type="submit">적용</Button>
            <a href="/admin/keywords">
              <Button type="button" variant="outline" className="w-full">
                초기화
              </Button>
            </a>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>키워드 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>키워드</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>의도</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.keyword}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.searchIntent}</TableCell>
                  <TableCell>{item.priorityScore.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
