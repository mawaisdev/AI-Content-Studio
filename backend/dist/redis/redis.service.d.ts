import Redis from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor();
    getClient(): Redis;
    set(key: string, value: string, ttl?: number): Promise<"OK">;
    get(key: string): Promise<string | null>;
}
