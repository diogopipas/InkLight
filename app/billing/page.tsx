import { startCheckout, openBillingPortal } from "./actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BillingPage() {
  const session = await requireUser();
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });

  const isActive = subscription?.status === "active";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>Your subscription is managed with Stripe.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Accessibility Monitoring</p>
            <p className="text-sm text-muted-foreground">SKU: price_site_monitoring_monthly</p>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <form action={startCheckout}>
            <Button type="submit" disabled={isActive}>
              {isActive ? "Subscription active" : "Start subscription"}
            </Button>
          </form>
          {subscription?.stripeCustomerId && (
            <form action={openBillingPortal}>
              <Button type="submit" variant="outline">
                Open customer portal
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
