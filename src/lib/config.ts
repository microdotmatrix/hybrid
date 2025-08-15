export const meta = {
  colors: {
    light: "#ffffff",
    dark: "#09090b",
  },
  title: "Next.js AI",
  description: "Next.js AI",
  keywords: ["Next.js", "AI", "MicrodotMatrix"],
  author: "MicrodotMatrix",
  url: "https://github.com/microdotmatrix/nextjs-ai",
};

interface NavItem {
  name: string;
  href: string;
}

export const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
];
