"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEntry } from "@/lib/actions/entries";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export const CreateEntryForm = () => {
  const [state, formAction, pending] = useActionState(createEntry, {
    errors: "",
  });

  // Show success toast when entry is created
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.message && !state?.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Memorial Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                required
                disabled={pending}
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Photo URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                disabled={pending}
              />
              {state?.errors?.imageUrl && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.imageUrl[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                disabled={pending}
              />
              {state?.errors?.dateOfBirth && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.dateOfBirth[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfDeath">Date of Death</Label>
              <Input
                id="dateOfDeath"
                name="dateOfDeath"
                type="date"
                disabled={pending}
              />
              {state?.errors?.dateOfDeath && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.dateOfDeath[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthLocation">Place of Birth</Label>
              <Input
                id="birthLocation"
                name="birthLocation"
                placeholder="City, State/Country"
                disabled={pending}
              />
              {state?.errors?.birthLocation && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.birthLocation[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deathLocation">Place of Death</Label>
              <Input
                id="deathLocation"
                name="deathLocation"
                placeholder="City, State/Country"
                disabled={pending}
              />
              {state?.errors?.deathLocation && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.deathLocation[0]}
                </p>
              )}
            </div>
          </div>

          {/* Display general message */}
          {state?.message && (
            <p
              className={`text-sm ${state?.success ? "text-green-600" : "text-destructive"}`}
              aria-live="polite"
            >
              {state.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button type="reset" variant="outline" disabled={pending}>
              Reset
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
