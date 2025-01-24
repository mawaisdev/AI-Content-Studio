import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redis: Redis

    constructor() {
        this.redis = new Redis({
            host: "localhost",
            port: 6379
        })
    }

    getClient() {
        return this.redis;
    }

    async set(key: string, value: string, ttl?: number){
        return ttl
        ? await this.redis.set(key, value, 'EX', ttl)
        : await this.redis.set(key, value)
    }

    async get(key: string) {
        return await this.redis.get(key)
    }
}
