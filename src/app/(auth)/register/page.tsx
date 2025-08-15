import { signUpAction } from "@/lib/auth/actions";
import { isAuthorized } from "@/lib/auth/server";
import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  await isAuthorized();

  return (
    <div className="grid gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign up with just your name and email.
        </p>
      </div>
      <SignUpForm action={signUpAction} />
      <div className="text-sm text-muted-foreground text-center">
        <span>Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
