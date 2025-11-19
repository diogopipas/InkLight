# Inklight

Automated web accessibility scanner that runs Playwright + axe-core audits, emails WCAG reports, and manages subscriptions through Stripe.

## Stack
- Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui primitives
- Prisma ORM with SQLite (dev) and PlanetScale (prod)
- NextAuth credentials (email + password)
- Stripe Checkout + webhooks
- Playwright + axe-core scanning engine
- Resend transactional email
- Vercel cron for scheduled scans

## Environment variables
Create an `.env` file based on the following keys:

```
DATABASE_URL="file:./dev.db"      # or mysql connection string in production
NEXTAUTH_SECRET="complex-string"
NEXTAUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_live_or_test"
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID=price_site_monitoring_monthly

RESEND_API_KEY="re_..."
```

PlanetScale tip: use a `DATABASE_URL` in the `mysql://` format along with the Prisma PlanetScale guide.

## Local development
1. Install deps: `npm install`
2. Push Prisma schema (creates SQLite db locally): `npm run db:push`
3. Run the dev server: `npm run dev`
4. Visit `http://localhost:3000`

Playwright is included as a dependency. If running scans locally, ensure you install the browsers once via `npx playwright install chromium`.

## Stripe webhooks
Use the Stripe CLI to forward events locally:

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Events handled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

## Cron automation
`vercel.json` registers a weekly cron hitting `/api/run-scan` every Monday at 09:00 UTC. Manual scans are also available from the dashboard.

## Email reports
Resend sends HTML summaries with total issues, severity badges, and a CTA back to the dashboard. If `RESEND_API_KEY` is missing, emails are skipped gracefully.

## Database schema
Prisma models are defined in `prisma/schema.prisma` and include `User`, `Site`, `ScanResult`, and `Subscription` exactly as required.

## Deployment
Deploy to Vercel:
1. `vercel link`
2. Set environment variables in the Vercel dashboard
3. `vercel --prod`

PlanetScale + Stripe webhooks need to be configured in production as well. Once deployed, cron + API routes handle ongoing scans automatically.
