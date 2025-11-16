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
  if (!body?.url) {
    return NextResponse.json({ message: "URL is required" }, { status: 400 });
  }

  let normalizedUrl: string;
  try {
    const withProtocol = /^https?:\/\//i.test(body.url) ? body.url : `https://${body.url}`;
    const parsed = new URL(withProtocol);
    normalizedUrl = parsed.origin;
  } catch (error) {
    return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
  }

  const existing = await prisma.site.findFirst({
    where: { url: normalizedUrl, userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ message: "Site already added" }, { status: 409 });
  }

  const site = await prisma.site.create({
    data: {
      url: normalizedUrl,
      userId: session.user.id,
    },
  });

  return NextResponse.json(site);
}
