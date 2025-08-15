"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/utils";
import { useActionState } from "react";

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  token: string;
};

export const ResetPasswordForm = ({ action, token }: Props) => {
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
          <input type="hidden" name="token" value={token} />
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
