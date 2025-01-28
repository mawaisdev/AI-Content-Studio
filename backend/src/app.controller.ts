import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/protected-endpoint')
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
