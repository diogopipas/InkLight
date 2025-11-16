import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe, findUserIdByCustomerId, upsertSubscriptionFromStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ message: "Missing webhook secret" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error", error);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || (await findUserIdByCustomerId(session.customer as string));
        if (userId && session.subscription) {
          await upsertSubscriptionFromStripe({
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
            status: "active",
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await findUserIdByCustomerId(subscription.customer as string);
        if (userId) {
          await upsertSubscriptionFromStripe({
            userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubId: subscription.id,
            status: subscription.status,
          });
        }
        break;
      }
      default: {
        break;
      }
    }
  } catch (error) {
    console.error("Stripe webhook processing error", error);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
