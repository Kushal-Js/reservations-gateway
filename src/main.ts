import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { setApp } from './app';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { cors: true });
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: [
      'http://localhost:3005',
      'http://127.0.0.1:3005',
      'http://52.54.163.134:3005',
      'http://http://3.91.234.188:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  await app.listen(configService.get('GATEWAY_HTTP_PORT'));
  setApp(app);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
}
bootstrap();
