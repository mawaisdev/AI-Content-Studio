import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const configSchema = z.object({
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  CACHE_TTL: z.coerce.number().default(3600),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string(),
});

export interface AppConfig {
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;
  databaseUrl: string;
  jwtSecret: string;
  redis: {
    host: string;
    port: number;
  };
  cacheTtl: number;
  openaiApiKey: string;
  openaiModel: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    postgresDb: process.env.POSTGRES_DB || 'database',
    postgresUser: process.env.POSTGRES_USER || 'user',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'password',
    databaseUrl:
      process.env.DATABASE_URL ||
      'postgresql://user:password@localhost:5432/database?schema=public',
    jwtSecret:
      process.env.JWT_SECRET ||
      'v2.local.eK7F9g_oPBtT5AqD_QbpZ8RxN1Q9SZ9CiS7z4k0W44TP7fGj09M2qqRxylKvdWmvUzUXE8bFPy0V_lOuAw0RXMQ',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10),
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  }),
);
