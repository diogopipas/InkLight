import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  const email = String(body.email).toLowerCase();
  const password = String(body.password);

  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Account already exists" }, { status: 409 });
  }

  const hashed = await hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed } });

  return NextResponse.json({ ok: true });
}
