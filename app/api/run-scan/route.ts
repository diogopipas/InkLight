import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAccessibilityScan } from "@/lib/scanner";
import { sendScanReportEmail } from "@/lib/email";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const siteId: string | undefined = payload?.siteId;

  if (siteId) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
    if (subscription?.status !== "active") {
      return NextResponse.json({ message: "Subscription inactive" }, { status: 403 });
    }

    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: session.user.id },
      include: { user: true },
    });

    if (!site) {
      return NextResponse.json({ message: "Site not found" }, { status: 404 });
    }

    const report = await scanAndPersist(site.id, site.url, site.user.email);
    return NextResponse.json(report);
  }

  const processed = await runScheduledScans();

  return NextResponse.json({ ok: true, processed });
}

export async function GET() {
  const processed = await runScheduledScans();
  return NextResponse.json({ ok: true, processed });
}

async function runScheduledScans() {
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: "active" },
    include: { user: { include: { sites: true } } },
  });

  let processed = 0;

  for (const subscription of activeSubscriptions) {
    const userEmail = subscription.user.email;
    for (const site of subscription.user.sites) {
      try {
        await scanAndPersist(site.id, site.url, userEmail);
        processed += 1;
      } catch (error) {
        console.error("Failed to scan site", site.id, error);
      }
    }
  }

  return processed;
}

async function scanAndPersist(siteId: string, url: string, email: string) {
  const report = await runAccessibilityScan(url);
  const record = await prisma.scanResult.create({
    data: {
      siteId,
      issues: report,
    },
  });

  if (email) {
    await sendScanReportEmail({
      to: email,
      siteUrl: url,
      dashboardUrl: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/site/${siteId}`,
      violations: report.violations,
    });
  }

  return { report, record };
}
