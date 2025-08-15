import { signInAction } from "@/lib/auth/actions";
import { isAuthorized } from "@/lib/auth/server";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export default async function LoginPage() {
  await isAuthorized();

  return (
    <div className="grid gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Enter your credentials.
        </p>
      </div>
      <SignInForm action={signInAction} />
      <div className="text-sm text-muted-foreground text-center">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
