import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Public } from './common/decorators/public.decorator';
import { Authenticated } from './common/decorators/authenticated.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/protected')
  @Authenticated()
  protectedRoute() {
    return { message: 'This is protected' };
  }

  @Public()
  @Get('/cache-test')
  async cacheTest() {
    const cached = await this.cacheManager.get('test');
    if (!cached) {
      await this.cacheManager.set('test', 'redis_works', 10);
      return { status: 'cached', value: 'redis_works' };
    }
    return { status: 'cached', value: cached };
  }
}
