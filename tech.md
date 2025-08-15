# Project Tech Stack

Below is a concise, AI-friendly manifest and summary of the project's primary technologies and versions. Tools like Cascade and other AI IDEs can parse the JSON block to optimize assistance and reasoning.

## AI Tooling Manifest

```json
{
  "schema_version": "1.0.0",
  "generated_at": "2025-08-13T10:43:48-05:00",
  "project": {
    "name": "next16-ai",
    "version": "0.1.0",
    "private": true,
    "root": "/home/microdotmatrix/www/nextjs/ai-experiments/hybrid"
  },
  "framework": {
    "name": "next",
    "version": "^15.4.6",
    "app_router": true,
    "dev_server": "next dev --turbopack"
  },
  "runtime": {
    "react": "19.1.0",
    "react_dom": "19.1.0",
    "typescript": "^5.9.2",
    "node": null
  },
  "styling": {
    "tailwindcss": "^4.1.11",
    "tailwind_plugins": ["@tailwindcss/postcss", "tw-animate-css"],
    "class_utilities": ["clsx", "class-variance-authority"],
    "theme": "next-themes"
  },
  "ui": {
    "radix_ui": "^1.4.2",
    "icons": { "lucide-react": "^0.525.0", "@iconify/react": "^6.0.0" },
    "date_picker": "react-day-picker@^9.8.1",
    "animation": "motion@^12.23.12"
  },
  "database": {
    "orm": { "drizzle-orm": "^0.44.4", "drizzle-kit": "^0.31.4" },
    "driver": { "@neondatabase/serverless": "^1.0.1" },
    "types": { "@types/pg": "^8.15.5" }
  },
  "validation": {
    "zod": "^4.0.17"
  },
  "auth": {
    "better-auth": "^1.3.6",
    "env": "@t3-oss/env-nextjs@^0.13.8"
  },
  "email": {
    "react_email_components": "^0.5.0",
    "resend": "^6.0.1"
  },
  "ai": {
    "ai_sdk": {
      "@ai-sdk/provider": "^2.0.0",
      "@ai-sdk/openai": "^2.0.11",
      "@ai-sdk/anthropic": "^2.0.2",
      "@ai-sdk/xai": "^2.0.6",
      "@ai-sdk/rsc": "^1.0.11"
    },
    "ai_core": { "ai": "^3.0.0" }
  },
  "build": {
    "react_compiler": "babel-plugin-react-compiler@^19.1.0-rc.2",
    "turbopack": true
  },
  "utilities": {
    "date_fns": "^4.1.0",
    "tailwind_merge": "^3.3.1",
    "dotenv": "^17.2.1",
    "server_only": "^0.0.1",
    "sonner": "^2.0.7",
    "input_otp": "^1.4.2"
  },
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "notes": [
    "No explicit Node.js engine specified in package.json.",
    "Radix UI primitives present; no explicit shadcn dependency detected in package.json.",
    "Next.js 15 with App Router and Turbopack in dev/build scripts."
  ]
}
```

## Summary (Human-readable)

- **Framework**: Next.js `^15.4.6` (App Router), React `19.1.0`, TypeScript `^5.9.2`.
- **Styling**: Tailwind CSS `^4.1.11`, class utilities (`clsx`, `class-variance-authority`), theming via `next-themes`.
- **UI**: Radix UI `^1.4.2`, Icons (`lucide-react`, `@iconify/react`), Date UI (`react-day-picker`), Animations (`motion`).
- **Database**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`) with Neon serverless driver.
- **Validation**: Zod `^4.0.17`.
- **Auth**: `better-auth`, env management via `@t3-oss/env-nextjs`.
- **Email**: `@react-email/components`, Resend.
- **AI/LLM**: Vercel AI SDK packages (`@ai-sdk/*`).
- **Build Tooling**: Turbopack; React Compiler plugin.
- **Scripts**: `dev`, `build`, `start`, `lint`, and Drizzle tasks (`db:*`).

## Maintenance

- **Update cadence**: Keep versions in the JSON manifest in sync with `package.json` after dependency updates.
- **Extend manifest**: Add inferred runtime details (e.g., Node version) and DB/hosting info when available.
