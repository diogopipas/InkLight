import Link from "next/link";
import { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/billing", label: "Billing" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="container space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>
          <h1 className="text-3xl font-semibold">Accessibility dashboard</h1>
        </div>
        <nav className="flex gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="rounded-3xl border bg-white p-6 shadow-sm">{children}</div>
    </section>
  );
}
