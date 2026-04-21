import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminPostsPage() {
  const posts = process.env.DATABASE_URL
    ? await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">포스트 관리</h1>
      <Card>
        <CardHeader>
          <CardTitle>전체 포스트</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>슬러그</TableHead>
                <TableHead>발행상태</TableHead>
                <TableHead>발행일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>
                    <StatusBadge status={post.isPublished ? "PUBLISHED" : "DRAFTED"} />
                  </TableCell>
                  <TableCell>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ko-KR") : "-"}
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
