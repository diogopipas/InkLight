import Link from "next/link";
import { ArrowRight, BarChart3, Mail, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Automated scans",
    description: "Schedule Playwright-powered WCAG sweeps across every page.",
    icon: Zap,
  },
  {
    title: "Actionable reports",
    description: "Receive Resend emails with severity badges and quick links.",
    icon: Mail,
  },
  {
    title: "Compliance peace of mind",
    description: "Track historical issues and prove continuous monitoring.",
    icon: ShieldCheck,
  },
];

const stats = [
  { title: "Issues tracked", value: "4.7M+" },
  { title: "Sites monitored", value: "3,200" },
  { title: "Average fix time", value: "2.3 days" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="container grid gap-10 py-16 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Automated Accessibility Monitoring
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Catch accessibility regressions before your customers do.
          </h1>
          <p className="text-lg text-muted-foreground">
            A11yScan uses Playwright + axe-core to crawl your critical flows, surface WCAG
            violations, and notify your team in real-time via dashboard, email, and API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up" className="gap-2">
                Start monitoring <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-xl border bg-white/60 p-4 shadow-sm">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase text-muted-foreground">{stat.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border bg-black p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-wide text-white/70">Live report</p>
          <h2 className="mt-3 text-3xl font-semibold">Accessibility overview</h2>
          <div className="mt-8 space-y-6">
            {[
              { impact: "Critical", count: 4, color: "bg-rose-500" },
              { impact: "Serious", count: 12, color: "bg-orange-400" },
              { impact: "Moderate", count: 21, color: "bg-amber-300" },
              { impact: "Minor", count: 37, color: "bg-emerald-400" },
            ].map((item) => (
              <div key={item.impact}>
                <div className="flex items-center justify-between text-sm">
                  <span>{item.impact}</span>
                  <span className="text-white/70">{item.count} issues</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${Math.min(item.count * 4, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-white/10 p-5">
            <p className="text-sm uppercase text-white/60">Next scan</p>
            <p className="text-2xl font-semibold">Monday · 09:00 UTC</p>
            <p className="text-sm text-white/70">Vercel cron triggers the Playwright engine weekly.</p>
          </div>
        </div>
      </section>

      <section id="features" className="container grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <feature.icon className="h-5 w-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="container grid gap-8 rounded-3xl border bg-white p-10 shadow-xl lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-muted-foreground">How it works</p>
          <h2 className="text-3xl font-semibold text-balance">From URL to actionable issue list in one minute.</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Add your domain.</strong> Secure auth via NextAuth keeps every dashboard private.
            </li>
            <li>
              <strong className="text-foreground">2. We launch Playwright.</strong> Headless Chromium renders your pages and injects axe-core.
            </li>
            <li>
              <strong className="text-foreground">3. Receive prioritized fixes.</strong> Severity filters, node snippets, and Resend emails keep teams aligned.
            </li>
          </ol>
        </div>
        <div className="rounded-2xl border bg-muted/50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sample issue</p>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-orange-500">Serious</p>
              <p className="mt-1 font-medium">Forms must have accessible names</p>
              <p className="text-muted-foreground">Button element is missing discernible text.</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-rose-500">Critical</p>
              <p className="mt-1 font-medium">Image elements must have alt text</p>
              <p className="text-muted-foreground">IMG element missing an alt attribute.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container">
        <div className="rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-wide text-white/70">Simple pricing</p>
          <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-semibold">$49<span className="text-2xl">/mo</span></h2>
              <p className="mt-3 max-w-xl text-white/70">
                Unlimited scans for one production site. Includes automated weekly cron runs, on-demand rescans, and instant email alerts.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Stripe-powered billing & invoices</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> PlanetScale production-ready database</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Priority email alerts via Resend</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 text-center lg:w-80">
              <p className="text-sm text-white/80">Subscription ID:</p>
              <p className="text-lg font-semibold">price_site_monitoring_monthly</p>
              <Button asChild size="lg" className="mt-6 w-full bg-white text-black hover:bg-white/90">
                <Link href="/billing">Go to billing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
