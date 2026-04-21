import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PublishButton } from "@/components/admin/publish-button";

export default async function AdminDraftsPage() {
  const drafts = process.env.DATABASE_URL
    ? await prisma.post.findMany({
        where: { isPublished: false },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">초안 관리</h1>
      <Card>
        <CardHeader>
          <CardTitle>초안 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell>{draft.title}</TableCell>
                  <TableCell>{draft.category}</TableCell>
                  <TableCell>{new Date(draft.createdAt).toLocaleDateString("ko-KR")}</TableCell>
                  <TableCell>
                    <PublishButton postId={draft.id} />
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
