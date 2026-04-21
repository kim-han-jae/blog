import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CTABox({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="border-zinc-300 bg-zinc-50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-zinc-600">{description}</p>
        <Link href={href} target="_blank" rel="noreferrer">
          <Button className="whitespace-nowrap">탐색해보세요</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
