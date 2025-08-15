import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Management",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex items-center justify-center px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
