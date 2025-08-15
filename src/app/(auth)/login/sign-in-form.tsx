"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/utils";
import Link from "next/link";
import { useActionState } from "react";

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export const SignInForm = ({ action }: Props) => {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  return (
    <Card>
      <CardContent className="grid gap-4 py-6">
        {state?.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={state?.email}
              required
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue={state?.password}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                name="rememberMe"
                type="checkbox"
                className="size-4 rounded border"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
