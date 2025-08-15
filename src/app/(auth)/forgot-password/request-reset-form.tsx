"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/utils";
import { useActionState } from "react";

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export const RequestResetForm = ({ action }: Props) => {
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
        {state?.success ? (
          <p className="text-sm text-green-600" role="status">
            {state.success}
          </p>
        ) : null}
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
