import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BASE_URL: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    XAI_API_KEY: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
  },
  createFinalSchema: (env) => {
    return z.object(env).transform((val) => {
      const {
        DATABASE_URL,
        BASE_URL,
        OPENAI_API_KEY,
        RESEND_API_KEY,
        ANTHROPIC_API_KEY,
        XAI_API_KEY,
        BLOB_READ_WRITE_TOKEN,
        ...rest
      } = val;
      return {
        DATABASE_URL,
        BASE_URL,
        OPENAI_API_KEY,
        RESEND_API_KEY,
        ANTHROPIC_API_KEY,
        XAI_API_KEY,
        BLOB_READ_WRITE_TOKEN,
        ...rest,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BASE_URL: process.env.BASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    XAI_API_KEY: process.env.XAI_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
});
