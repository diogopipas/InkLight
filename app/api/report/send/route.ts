import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendScanReportEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.siteId) {
    return NextResponse.json({ message: "siteId is required" }, { status: 400 });
  }

  const site = await prisma.site.findFirst({
    where: { id: body.siteId, userId: session.user.id },
    include: {
      user: true,
      scans: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!site?.scans[0]) {
    return NextResponse.json({ message: "No scans available" }, { status: 404 });
  }

  const violations = (site.scans[0].issues as { violations?: any[] })?.violations ?? [];

  await sendScanReportEmail({
    to: site.user.email,
    siteUrl: site.url,
    dashboardUrl: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/site/${site.id}`,
    violations,
  });

  return NextResponse.json({ ok: true });
}
