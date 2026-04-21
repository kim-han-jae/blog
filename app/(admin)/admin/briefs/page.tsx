import { revalidatePath } from "next/cache";
import { BriefStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";

async function updateBriefStatus(formData: FormData) {
  "use server";
  const briefId = String(formData.get("briefId"));
  const status = String(formData.get("status")) as BriefStatus;
  if (!briefId) return;

  await prisma.contentBrief.update({
    where: { id: briefId },
    data: { status },
  });
  revalidatePath("/admin/briefs");
}

export default async function AdminBriefsPage() {
  const briefs = process.env.DATABASE_URL
    ? await prisma.contentBrief.findMany({
        include: { keyword: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">브리프 관리</h1>

      <Card>
        <CardHeader>
          <CardTitle>브리프 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>키워드</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {briefs.map((brief) => (
                <TableRow key={brief.id}>
                  <TableCell>{brief.keyword.keyword}</TableCell>
                  <TableCell>{brief.workingTitle}</TableCell>
                  <TableCell>
                    <StatusBadge status={brief.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <form action={updateBriefStatus}>
                        <input type="hidden" name="briefId" value={brief.id} />
                        <input type="hidden" name="status" value={BriefStatus.APPROVED} />
                        <Button size="sm" variant="secondary">
                          승인
                        </Button>
                      </form>
                      <form action={updateBriefStatus}>
                        <input type="hidden" name="briefId" value={brief.id} />
                        <input type="hidden" name="status" value={BriefStatus.REJECTED} />
                        <Button size="sm" variant="outline">
                          반려
                        </Button>
                      </form>
                    </div>
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
