import { z } from "zod";

const envSchema = z.object({
  // GOOGLE_OAUTH_CLIENT_ID: z.string(),
  // GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  // GOOGLE_OAUTH_REDIRECT_URI: z.string(),

  JWT_SECRET: z.string().describe("secret key for JWT secret"),

  BASE_URL: z.string().describe("base url for the application"),
  // mail config
  SMTP_HOST: z.string().describe("smtp host"),
  SMTP_PORT: z.coerce.number().describe("smtp port"),
  SMTP_SECURE: z.coerce.boolean().describe("smtp secure"),
  SMTP_USER: z.string().describe("smtp user"),
  SMTP_PASS: z.string().describe("smtp pass"),

});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
