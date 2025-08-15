"use server";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env/server";
import { action, type ActionState } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  rememberMe: z.string().optional(), // checkbox => "on" | undefined
});

export const signInAction = action(
  SignInSchema,
  async (data): Promise<ActionState> => {
    try {
      await auth.api.signInEmail({
        headers: await headers(),
        body: {
          email: data.email,
          password: data.password,
          // Better Auth expects boolean; treat presence of checkbox as true
          rememberMe: data.rememberMe ? true : undefined,
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign in";
      console.error(e);
      return { error: message };
    }
    // Important: call redirect outside the try/catch so it isn't swallowed
    redirect("/dashboard");
  }
);

const SignUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(64),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const signUpAction = action(
  SignUpSchema,
  async (data): Promise<ActionState> => {
    try {
      await auth.api.signUpEmail({
        headers: await headers(),
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: `${env.BASE_URL}/dashboard`,
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to register";
      return { error: message };
    }
    // See note in signInAction – do not wrap redirect in try/catch
    redirect("/dashboard");
  }
);

const RequestResetSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const requestPasswordResetAction = action(
  RequestResetSchema,
  async (data): Promise<ActionState> => {
    try {
      await auth.api.requestPasswordReset({
        body: {
          email: data.email,
          redirectTo: `${env.BASE_URL}/reset-password`,
        },
      });
      return { success: "Password reset email sent. Check your inbox." };
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to send reset email";
      return { error: message };
    }
  }
);

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid reset token"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const resetPasswordAction = action(
  ResetPasswordSchema,
  async (data): Promise<ActionState> => {
    try {
      await auth.api.resetPassword({
        body: {
          token: data.token,
          newPassword: data.newPassword,
        },
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to reset password";
      return { error: message };
    }
    redirect("/login?reset=success");
  }
);

export const signOutAction = async (): Promise<void> => {
  "use server";
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
};
