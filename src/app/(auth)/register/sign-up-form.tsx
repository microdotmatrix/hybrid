"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export const SignUpForm = ({ action }: Props) => {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={state?.name}
              required
              autoComplete="name"
            />
          </div>
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              required
              autoComplete="new-password"
              aria-invalid={passwordsMismatch || undefined}
              className={
                passwordsMatch
                  ? "border-green-600 focus-visible:ring-green-600"
                  : passwordsMismatch
                    ? "border-destructive"
                    : undefined
              }
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
