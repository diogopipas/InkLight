import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.siteId) {
    return NextResponse.json({ message: "Site ID is required" }, { status: 400 });
  }

  const site = await prisma.site.findFirst({ where: { id: body.siteId, userId: session.user.id } });
  if (!site) {
    return NextResponse.json({ message: "Site not found" }, { status: 404 });
  }

  await prisma.site.delete({ where: { id: body.siteId } });
  return NextResponse.json({ ok: true });
}
