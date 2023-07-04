import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ping from './ping';

async function start() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

start();

setInterval(ping, 1000 * 60 * 10);
