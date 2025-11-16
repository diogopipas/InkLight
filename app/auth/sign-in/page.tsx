import Link from "next/link";
import { AuthFormSignIn } from "./sign-in-form";

export default function SignInPage() {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to access your dashboard.</p>
      </div>
      <div className="mt-8">
        <AuthFormSignIn />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need an account? <Link href="/auth/sign-up" className="font-medium text-primary">Create one</Link>
      </p>
    </div>
  );
}
