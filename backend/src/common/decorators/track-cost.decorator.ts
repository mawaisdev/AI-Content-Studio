import { Inject, Injectable, mixin } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export function TrackCost(userId: string) {
  @Injectable()
  class CostTracker {
    constructor(@Inject(CACHE_MANAGER) public readonly cacheManager: Cache) {}

    async track(tokens: number) {
      const key = `user:${userId}:tokens`;
      const current = (await this.cacheManager.get<number>(key)) || 0;
      await this.cacheManager.set(key, current + tokens, 0);
    }
  }
  return mixin(CostTracker);
}
