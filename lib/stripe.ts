import Stripe from "stripe";
import { prisma } from "./prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

const priceId = process.env.STRIPE_PRICE_ID || "price_site_monitoring_monthly";

function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
}

export async function ensureStripeCustomer(userId: string, email: string) {
  assertStripeConfigured();
  const existing = await prisma.subscription.findUnique({ where: { userId } });
  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId;
  }

  const customer = await stripe.customers.create({ email });

  if (existing) {
    await prisma.subscription.update({
      where: { userId },
      data: { stripeCustomerId: customer.id },
    });
  } else {
    await prisma.subscription.create({
      data: {
        user: { connect: { id: userId } },
        stripeCustomerId: customer.id,
        stripeSubId: "",
        status: "inactive",
      },
    });
  }
  return customer.id;
}

export async function createCheckoutSession(userId: string, email: string) {
  assertStripeConfigured();
  const customerId = await ensureStripeCustomer(userId, email);
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/billing?status=success`,
    cancel_url: `${baseUrl}/billing?status=cancel`,
    metadata: { userId },
  });
}

export async function createBillingPortalSession(userId: string) {
  assertStripeConfigured();
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription?.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/billing`,
  });
}

export async function upsertSubscriptionFromStripe(payload: {
  userId: string;
  stripeCustomerId: string;
  stripeSubId: string;
  status: string;
}) {
  return prisma.subscription.upsert({
    where: { userId: payload.userId },
    create: {
      user: { connect: { id: payload.userId } },
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubId: payload.stripeSubId,
      status: payload.status,
    },
    update: {
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubId: payload.stripeSubId,
      status: payload.status,
    },
  });
}

export async function findUserIdByCustomerId(customerId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });
  return subscription?.userId;
}
