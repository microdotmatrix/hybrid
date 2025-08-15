import { requestPasswordResetAction } from "@/lib/auth/actions";
import { RequestResetForm } from "./request-reset-form";

export default function ForgotPasswordPage() {
  return (
    <div className="grid gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you a reset link.
        </p>
      </div>
      <RequestResetForm action={requestPasswordResetAction} />
    </div>
  );
}
