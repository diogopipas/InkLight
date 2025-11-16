import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizeUrl(rawUrl: string) {
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const parsed = new URL(withProtocol);
  return parsed.origin;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const siteId = body?.siteId as string | undefined;
  const url = body?.url as string | undefined;

  if (!siteId || !url) {
    return NextResponse.json({ message: "siteId and url are required" }, { status: 400 });
  }

  const site = await prisma.site.findFirst({
    where: { id: siteId, userId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ message: "Site not found" }, { status: 404 });
  }

  let normalizedUrl: string;
  try {
    normalizedUrl = normalizeUrl(url);
  } catch {
    return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
  }

  const conflict = await prisma.site.findFirst({
    where: {
      userId: session.user.id,
      url: normalizedUrl,
      NOT: { id: siteId },
    },
  });
  if (conflict) {
    return NextResponse.json({ message: "Site already exists" }, { status: 409 });
  }

  const updated = await prisma.site.update({
    where: { id: siteId },
    data: { url: normalizedUrl },
  });

  return NextResponse.json(updated);
}

