import { resetPasswordAction } from "@/lib/auth/actions";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams)?.token ?? "";

  return (
    <div className="grid gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">Choose a new password.</p>
      </div>
      <ResetPasswordForm action={resetPasswordAction} token={token} />
    </div>
  );
}
