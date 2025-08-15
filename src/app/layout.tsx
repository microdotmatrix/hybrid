import { AppContext } from "@/components/context";
import { HexPattern } from "@/components/elements/svg/hex-pattern";
import { Header } from "@/components/layout/header";
import { getSession } from "@/lib/auth/server";
import { meta } from "@/lib/config";
import { User } from "@/lib/db/schema";
import { code, display, text } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: `%s | ${meta.title}`,
    default: meta.title,
  },
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: meta.author }],
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: `${meta.colors.dark}` },
    { media: "(prefers-color-scheme: light)", color: `${meta.colors.light}` },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getSession();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={cn(
          display.variable,
          text.variable,
          code.variable,
          "antialiased"
        )}
      >
        <AppContext>
          <Header user={user as User} />
          {children}
          <BackgroundPattern />
        </AppContext>
      </body>
    </html>
  );
}

const BackgroundPattern = () => {
  return (
    <>
      <HexPattern className="text-primary/10 size-2/3 stroke-0 opacity-15 fixed -z-10 top-1/3 right-12 starting:opacity-0 transition-all duration-1000 delay-500 starting:blur-xl blur-none" />
      <HexPattern className="text-primary/20 size-1/3 opacity-15 fixed -z-10 top-1/4 right-1/8 starting:opacity-0 transition-all duration-2000 delay-1500 starting:blur-none blur-xl" />
      <HexPattern className="text-primary/25 size-3/4 stroke-0 opacity-25 fixed -z-10 top-1/2 right-0 starting:opacity-0 transition-all duration-1500 delay-500 starting:blur-none blur-2xl" />
    </>
  );
};
