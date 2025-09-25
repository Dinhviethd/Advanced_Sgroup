// env.ts
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || 'development';
const isTest = NODE_ENV === 'test';
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default(isTest ? 'test' : 'development'),
  HOST: z.string().default(isTest ? 'localhost' : 'localhost'),
  PORT: z.coerce.number().default(isTest ? 3000 : 3000),
  CORS_ORIGIN: z.string().default(isTest ? 'http://localhost:3000' : 'http://localhost:3000'),
});
export const appEnv = envSchema.parse(process.env);

