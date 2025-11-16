import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">Spin up automated accessibility scans in minutes.</p>
      </div>
      <div className="mt-8">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/auth/sign-in" className="font-medium text-primary">Sign in</Link>
      </p>
    </div>
  );
}
