"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBillingPortalSession, createCheckoutSession } from "@/lib/stripe";

export async function startCheckout() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } });
  if (!user?.email) {
    throw new Error("Missing email");
  }
  const checkout = await createCheckoutSession(session.user.id, user.email);
  redirect(checkout.url ?? "/billing");
}

export async function openBillingPortal() {
  const session = await requireUser();
  const portal = await createBillingPortalSession(session.user.id);
  redirect(portal.url);
}
