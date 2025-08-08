import dotenv from 'dotenv';
import { z } from 'zod';
import logger from '../shared/logger';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("8080"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  OPENWEATHER_API_KEY: z.string().min(1, "OpenWeather API key is required"),
  OPENWEATHER_API_BASE_URL: z
    .string()
    .url()
    .default("https://api.openweathermap.org/data/2.5"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_DATABASE_URL: z.string().url().optional(),
  FRONTEND_BASE_URL: z.string().url().optional(),
});

const parseEnv = () => {
  try {
    const parsed = envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
      OPENWEATHER_API_BASE_URL: process.env.OPENWEATHER_API_BASE_URL,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    });
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("Environment validation failed");
      error.errors.forEach((err) => {
        logger.error(`  ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>; 