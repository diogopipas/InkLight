import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViolationsTable, Violation } from "@/components/dashboard/violations-table";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/utils";

export default async function SitePage({ params }: { params: { id: string } }) {
  const session = await requireUser();
  const site = await prisma.site.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!site) {
    notFound();
  }

  const latest = site.scans[0];
  const issues = (latest?.issues as { violations?: Violation[] } | null)?.violations ?? [];
  const grouped = issues.reduce<Record<string, number>>((acc, violation) => {
    const key = violation.impact ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Site URL</p>
          <h1 className="text-2xl font-semibold">{site.url}</h1>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>Last scan</p>
          <p className="font-medium text-foreground">{latest ? formatRelativeDate(latest.createdAt) : "Never"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Breakdown by impact level</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          {["critical", "serious", "moderate", "minor"].map((impact) => (
            <div key={impact} className="rounded-2xl border p-4">
              <p className="text-xs uppercase text-muted-foreground">{impact}</p>
              <p className="mt-2 text-2xl font-semibold">{grouped[impact] ?? 0}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {latest ? (
        <ViolationsTable violations={issues} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No scans yet. Run your first audit from the dashboard.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Scan history</CardTitle>
          <CardDescription>Last {site.scans.length} runs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {site.scans.map((scan) => {
            const scanViolations = (scan.issues as { violations?: Violation[] } | null)?.violations ?? [];
            return (
              <div key={scan.id} className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{formatRelativeDate(scan.createdAt)}</p>
                  <p className="text-muted-foreground">{scanViolations.length} violations</p>
                </div>
                <Badge variant={scanViolations.length > 0 ? "secondary" : "default"}>
                  {scanViolations.length > 0 ? "Issues found" : "Clean"}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
