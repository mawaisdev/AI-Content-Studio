/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  );
  app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );
    next();
  });
  app.enableCors();

  // Global Validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalGuards(
    new JwtAuthGuard(app.get(Reflector))
  ); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// Add these type definitions if needed
declare global {
  interface Blob {
    arrayBuffer(): Promise<ArrayBuffer>;
  }
}