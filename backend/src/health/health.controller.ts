// /* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import Redis from 'ioredis';

// @Public()
// @Controller('health')
// export class HealthController {
//   constructor(
//     private health: HealthCheckService,
//     private memory: MemoryHealthIndicator,
//     private prisma: PrismaService,
//     @InjectRedis() private readonly redis: Redis,
//   ) {}

//   @Get()
//   @HealthCheck()
//   check() {
//     return this.health.check([
//       async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
//       async () =>
//         this.prisma.$queryRaw`SELECT 1`.then(() => ({
//           prisma: { status: 'up' },
//         })),
//       async () => this.redis.ping().then(() => ({ redis: { status: 'up' } })),
//     ]);
//   }
// }

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () =>
        this.prisma.$queryRaw`SELECT 1`.then(() => ({
          prisma: { status: 'up' },
        })),
      async () => {
        // Use the cacheManager to check Redis connectivity
        await this.cacheManager.get('health-check');
        return { redis: { status: 'up' } };
      },
    ]);
  }
}
