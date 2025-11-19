# Inklight Master Plan — Blocked Items

Generated: 2025-11-18  
Author: GPT-5.1 Codex (Cursor)

## How to Use This List

- Each entry captures work that could not be executed within this environment because it requires production systems, external accounts, or stakeholder action.
- Once the prerequisite is available, move the item into the active project tracker and update the execution log.

## Blocked Topics & Tasks

| Step | Topic | Blocked Item | Reason | Unblock Owner |
| --- | --- | --- | --- | --- |
| 1 | Full Production QA | Run end-to-end tests in staging/prod, capture telemetry + Stripe evidence | Requires access to real environments, feature flags, Stripe test keys | Engineering / RevOps |
| 1 | Validation Scans | Secure volunteer domains, run real scans, capture before/after assets | Needs customer permissions and scanner infrastructure | Product Marketing |
| 1 | Observability | Deploy OpenTelemetry collectors, configure Datadog/Logtail, wire Slack alerts | Needs vendor accounts + infrastructure changes | Platform / DevOps |
| 1 | Data Privacy & Security | Legal review + publication of Privacy Policy, DPA, security FAQ | Requires counsel approval and hosting | Legal |
| 2 | Pricing & Packaging | Configure Stripe Products/Prices in live account, finalize ARR calculator with actual margins | Needs Stripe admin rights and finance data | RevOps / Finance |
| 2 | Self-Serve Billing | Embed real Stripe Customer Portal, verify webhooks with live keys | Requires production Stripe + frontend deployment | Engineering |
| 2 | Trial Automation | Trigger Resend drip campaigns and in-app banners in prod | Needs marketing automation + feature flags | Lifecycle Marketing |
| 2 | Revenue Operations | Connect Stripe → QuickBooks/Xero, enable ChartMogul/Baremetrics sync | Needs API keys + accounting access | Finance |
| 3 | Marketing Site Refresh | Ship updated copy/UX to production marketing site | Requires repo access + design sign-off | Marketing / Design |
| 3 | Content Engine | Publish content + gated assets, set up analytics UTMs | Needs CMS access + analytics credentials | Content |
| 3 | Outbound Play | Send sequences via CRM, track replies | Requires SDR tooling + contact permissions | Sales |
| 3 | Partnerships | Execute partner agreements, issue referral codes, track sourced revenue | Needs legal + RevOps systems | Partnerships |
| 4 | Policies | Finalize ToS/Privacy/DPA PDF formatting and acceptance tracking in app | Needs legal + engineering updates | Legal / Engineering |
| 4 | Expectations | Insert disclaimers into product + collateral | Requires product copy updates | Product Marketing |
| 4 | Customer Success | Load onboarding checklist + SLAs into CS tooling (HelpScout/Zendesk/Asana) | Needs tooling licenses | CS |
| 4 | Scaling Plan | Approve hiring plan, budget, and automation roadmap | Needs exec + finance approval | Leadership |
| 5 | Product Analytics | Implement PostHog/Amplitude SDK in code, provision infra | Requires code changes + vendor accounts | Engineering |
| 5 | Weekly KPI Review | Build live dashboard + assign data steward in BI tool | Needs BI stack + owner | RevOps |
| 5 | Feedback Loop | Launch in-app prompts + schedule interviews with customers | Needs live app + customer outreach | Product |
| 5 | Quarterly Roadmap Review | Hold cross-functional workshop w/ stakeholders | Needs leadership availability | Product / Leadership |

## Suggested Next Steps

1. Assign a DRI per blocked item (column above).
2. Capture due dates and prerequisites in the program tracker.
3. Once unblocked, reference `Inklight-master-plan-execution.md` for ready-made assets and begin implementation.

