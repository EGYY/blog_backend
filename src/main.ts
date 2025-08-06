import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use((cookieParser as () => any)());
  app.enableCors({
    origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
