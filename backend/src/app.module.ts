import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { UsersModule } from './users/users.module';
import { RedisService } from './redis/redis.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, 
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 6000,
        limit: 10
      }],
      errorMessage: "Too Many Requests! Slow down......"
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClientService, RedisService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
