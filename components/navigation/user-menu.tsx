"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function UserMenu({ email }: { email: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline-flex">{email}</span>
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </Button>
    </div>
  );
}
