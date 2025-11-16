import Link from "next/link";
import { Session } from "next-auth";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";

export function SiteHeader({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          A11yScan
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserMenu email={session.user.email ?? ""} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Create account</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
