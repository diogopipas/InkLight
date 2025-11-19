# Inklight Go-Live, Monetization & Growth Plan

## Step 1 — Go-Live Checklist

### Topic 1: Full Production QA
- **Objective:** Validate onboarding → scans → billing flows prior to launch with owners, pass/fail criteria, and sign-off artifacts.
- **Test Matrix:**
  - `Onboarding`: new signup, invite acceptance, SSO fallback; track UX defects + telemetry gaps; owner Product.
  - `Manual scans`: trigger, retry, multi-page queue, Axe/WCAG coverage, persistence; record runtime baseline; owner Engineering.
  - `Scheduled scans`: cron trigger, skip logic, DST edges, missed job recovery; owner Platform.
  - `WCAG report emails`: HTML/plain, attachments, Resend events, unsubscribe; monitor deliverability; owner Lifecycle.
  - `Stripe checkout & webhooks`: new sub, plan changes, failed payment, refunds, idempotency; owner RevOps.
  - `Subscription gating`: enforce plan limits, trial expiry, upgrade CTA; owner Frontend.
- **Test Data & Tooling:** Fixture sites across industries, synthetic flaky endpoints, Playwright traces, HAR files, Looker notebook for metrics.
- **Cadence:** Staging dry run (Day0) → bug fixes (Day1–2) → prod shadow run w/ feature flags (Day3) → sign-off review (Day4). Block go-live if any P0/P1 open.
- **Documentation:** Shared Notion QA tracker with evidence + signatures from Engineering, Product, RevOps.

### Topic 2: Validation Scans
- **Objective:** Stress-test scanning pipeline on real customer domains for accuracy/runtime and produce marketing evidence.
- **Target Cohort:** 5–10 volunteer sites (agency, SaaS, ecommerce, public-sector, blog, SPA, multilingual) with written permission.
- **Execution:**
  - Baseline crawl metadata (pages, tech stack, known issues, Lighthouse scores).
  - Run manual + scheduled scans; collect runtime, node count, rules triggered, false positives.
  - Deliver findings, wait 1–2 weeks for remediation, rerun scans, quantify delta.
  - Label violations by severity, WCAG criterion, automated/manual confirmation, remediation effort.
  - Log regressions (parser breaks, report ranking issues, queue stalls) with logs/traces.
- **Outputs:** Metrics sheet, before/after screenshots, internal confidence memo summarizing risks + hotfixes.
- **Risks/Mitigations:** Dynamic content drift (freeze snapshots), rate limiting (stagger + throttle), false positives (manual QA on top issues).

### Topic 3: Observability
- **Objective:** Establish end-to-end visibility for scans, billing, and messaging so incidents are detected within minutes.
- **Telemetry:**
  - `Application`: structured Vercel/Next logs, Playwright trace timings, request/user/scan IDs.
  - `Infrastructure`: uptime monitors, job queue depth, worker CPU/memory, Stripe webhook latency.
  - `Third-party`: Resend delivery stats, Stripe alerts, cron job success/failure.
  - `User-facing`: in-app toasts plus Slack/email alerts for failed scans, delayed reports, payment issues.
- **Implementation:**
  - Wire OpenTelemetry to Datadog/New Relic/Logtail.
  - Synthetic Playwright smoke test on demo site posting to #ops.
  - Forward Resend & Stripe failure events to Slack via Alertmanager.
  - Define log retention, access controls, PII redaction.
- **Runbooks & On-Call:** Document runbooks for scan failure, webhook backlog, email deliverability dip; light on-call rotation with pager thresholds (>5 failed scans/10 min).
- **Validation:** Chaos kill test, dashboard review with Product & Support, observability coverage doc in go-live checklist.

### Topic 4: Data Privacy & Security
- **Objective:** Demonstrate trustworthy handling of scan/user/billing data and baseline privacy compliance.
- **Policy & Docs:** Security FAQ detailing data flow, retention, encryption, access; updated Privacy Policy + DPA (authorization, retention, subprocessors, user rights).
- **Controls:** Data retention automation (HTML 30d, reports 12m), TLS + at-rest encryption, secret rotation, least-privilege roles + audit trails, respect robots.txt, throttle requests, takedown channel.
- **Compliance Prep:** Map GDPR/CCPA obligations, DSR workflow, incident response plan, gather architecture & vendor artifacts.
- **Validation:** Privacy QA for log redaction, mock DSR (export/delete), legal review + distribution to Sales/Support.

## Step 2 — Monetization Launch

### Topic 1: Pricing & Packaging
- **Objective:** Align tiers with customer value and Stripe setup.
- **Actions:** Audience segmentation, define Starter/Growth/Enterprise limits + overages, configure Stripe Products/Prices/add-ons, build ARR/margin calculator.
- **Validation:** Benchmark vs competitors, review with design partners and Sales/CS.

### Topic 2: Self-Serve Billing
- **Objective:** Empower customers to self-manage subscriptions.
- **Actions:** Embed Stripe Customer Portal, add contextual upgrade buttons, implement webhooks syncing plan state + in-app confirmations, build billing settings page with plan/renewal/invoice/usage info.
- **Validation:** QA upgrade/downgrade/failed payment/VAT download flows.

### Topic 3: Trial Automation
- **Objective:** Maximize trial-to-paid conversion.
- **Actions:** Configure Stripe trials + webhook tracking, in-app countdown banners, Resend drip (welcome, mid-trial tip, pre-expiry urgency, post-expiry winback), enforce gating after expiry with upgrade CTA.
- **Validation:** Simulate lifecycle with test customer; verify email timing + state transitions.

### Topic 4: Revenue Operations
- **Objective:** Ensure finance reporting, churn analytics, compliance readiness.
- **Actions:** Connect Stripe to accounting (QuickBooks/Xero), integrate ProfitWell/Baremetrics/ChartMogul, set monthly close checklist, build revenue+usage dashboards.
- **Validation:** Mock monthly close, reconcile Stripe vs analytics, document revenue recognition policy.

## Step 3 — Go-To-Market

### Topic 1: Marketing Site Refresh
- **Objective:** Communicate value and increase conversions.
- **Actions:** Update messaging & CTAs, showcase sample report + testimonials, optimize SEO/UX, add localization where needed.
- **Validation:** Run Lighthouse + Wave checks, user-test, ensure messaging matches product.

### Topic 2: Content Engine
- **Objective:** Capture organic demand.
- **Actions:** Editorial calendar (blogs, WCAG guides, checklists), repurpose case studies as gated assets, distribute via LinkedIn/newsletters/communities with UTM tracking.
- **Validation:** Track traffic, dwell time, CTA conversion; iterate monthly.

### Topic 3: Outbound Play
- **Objective:** Generate pipeline with targeted outreach.
- **Actions:** Build 50–100 account list with enrichment, craft email sequence offering free baseline scan + Loom, manage CRM stages, weekly messaging review.
- **Validation:** Target ≥30% open and ≥10% reply; analyze objections.

### Topic 4: Partnerships
- **Objective:** Extend reach via consultants/agencies.
- **Actions:** Define referral/reseller tiers, partner toolkit (deck, sample report, onboarding), recruit accessibility consultants/dev agencies, track sourced revenue via partner codes.
- **Validation:** Secure 2–3 pilot partners, gather feedback, adjust terms.

## Step 4 — Operations & Legal

### Topic 1: Policies
- **Objective:** Provide clear contractual framework.
- **Actions:** Finalize ToS, Privacy Policy, DPA (scope, acceptable use, IP, liability caps); host with versioning; track acceptance.
- **Validation:** Legal review, procurement-ready responses.

### Topic 2: Expectations
- **Objective:** Set transparent boundaries on automated coverage.
- **Actions:** Publish capabilities matrix, add report disclaimers, train Sales/CS on messaging.
- **Validation:** Include in demos, collect clarity feedback.

### Topic 3: Customer Success
- **Objective:** Drive onboarding success and support.
- **Actions:** Onboarding checklist, SLAs per tier, escalation path, CS tooling (Notion/Asana + HelpScout/Zendesk) w/ NPS surveys.
- **Validation:** Pilot runbook with first customers, collect satisfaction, refine.

### Topic 4: Scaling Plan
- **Objective:** Anticipate headcount/contractor needs.
- **Actions:** Model workload vs MRR, define hiring triggers, prep training/KPIs, plan automation to delay hires, quarterly review with finance.
- **Validation:** Stress-test scenarios, maintain hiring backlog.

## Step 5 — Metrics & Iteration

### Topic 1: Product Analytics
- **Objective:** Track funnel and feature impact.
- **Actions:** Instrument PostHog/Amplitude events (signup, site added, first scan, report viewed, upgrade) with properties, build funnels/cohorts/session recordings, tie to feature flags.
- **Validation:** QA event order/payload, ensure consent + opt-out compliance.

### Topic 2: Weekly KPI Review
- **Objective:** Align team on performance drivers.
- **Actions:** Define KPIs (MRR, trial→paid %, scan success, critical issues/site, report CTR, churn reasons), auto-updated dashboard, weekly 30-min review with owners.
- **Validation:** Document definitions, assign data steward for monthly audits.

### Topic 3: Feedback Loop
- **Objective:** Capture qualitative insights for roadmap.
- **Actions:** In-app prompts post-scan, biweekly interviews (trial/paying/churned), tag feedback by area, close loop with roadmap updates/betas.
- **Validation:** Track response volume + satisfaction trend, ensure input to prioritization.

### Topic 4: Quarterly Roadmap Review
- **Objective:** Align product investments with revenue goals.
- **Actions:** Use KPI + feedback data for roadmap themes, run cross-functional scoring, publish internal/external roadmap, assign success metrics per initiative.
- **Validation:** Confirm alignment with Sales/CS needs; adjust with new intel.

## Appendices
- **Artifacts Needed:** QA tracker template, metrics sheet, pricing calculator, policy PDFs, runbooks, onboarding checklist, dashboard links.
- **Owners & Timeline:** Assign DRI per topic, maintain shared timeline to track readiness leading to launch date.
