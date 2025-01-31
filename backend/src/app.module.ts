import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { RedisThrottlerGuard } from './common/guards/custom-throttler.guard';
// import { configSchema } from './config/configuration';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AiModule } from './ai/ai.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './project/project.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: configSchema,
      // validationOptions: {
      //   abortEarly: true,
      // },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 1 minute window
          limit: 10, // 10 requests per window
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
        }),
      ),
    }),
    PrismaModule,
    AuthModule,
    RedisModule,
    TerminusModule,
    AiModule,
    ProjectModule,
    SupabaseModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RedisThrottlerGuard,
    },
    PrismaService,
    SupabaseService,
  ],
})
export class AppModule {}
