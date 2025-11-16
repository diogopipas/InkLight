import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json({ message: "siteId is required" }, { status: 400 });
  }

  const site = await prisma.site.findFirst({
    where: { id: siteId, userId: session.user.id },
    include: {
      scans: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!site?.scans[0]) {
    return NextResponse.json({ message: "No scans found" }, { status: 404 });
  }

  return NextResponse.json(site.scans[0]);
}
