import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
  ttl: parseInt(process.env.CACHE_TTL || '3600', 10) || 3600,
}));
