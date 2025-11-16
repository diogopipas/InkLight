import { AddSiteForm } from "@/components/forms/add-site-form";
import { SiteCard } from "@/components/dashboard/site-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      sites: {
        include: {
          scans: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const activeSubscription = user.subscription?.status === "active";
  const latestScan = user.sites
    .map((site) => site.scans[0])
    .filter((scan): scan is NonNullable<typeof scan> => Boolean(scan))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Subscription</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={activeSubscription ? "default" : "secondary"}>
              {activeSubscription ? "Active" : "Inactive"}
            </Badge>
            {user.subscription?.stripeSubId && (
              <span className="text-sm text-muted-foreground">{user.subscription.stripeSubId}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Last scan: {latestScan ? formatRelativeDate(latestScan.createdAt) : "Never"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add a website</CardTitle>
            <CardDescription>We run Playwright + axe-core audits on every saved URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddSiteForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automation status</CardTitle>
            <CardDescription>Vercel cron runs Mondays at 09:00 UTC.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Next scheduled scan</span>
              <span>Monday 09:00 UTC</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Emails</span>
              <span>{user.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {user.sites.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center text-muted-foreground">
              No websites yet. Add your first domain to begin monitoring.
            </CardContent>
          </Card>
        )}
        {user.sites.map((site) => {
          const issues = site.scans[0]?.issues as { violations?: unknown[] } | undefined;
          const issueCount = Array.isArray(issues?.violations) ? issues?.violations.length : 0;
          return (
            <SiteCard
              key={site.id}
              id={site.id}
              url={site.url}
              lastScan={site.scans[0]?.createdAt}
              issuesCount={issueCount}
            />
          );
        })}
      </div>
    </div>
  );
}
