import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Application Bootstrap
 * Ilovani ishga tushirish funksiyasi
 */
async function bootstrap() {
  // NestJS ilovasini yaratish
  const app = await NestFactory.create(AppModule);

  // Global validation pipe - barcha DTOlarni validatsiya qilish uchun
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO da yo'q fieldlarni o'chirish
      forbidNonWhitelisted: true, // DTO da yo'q fieldlar kelsa - error
      transform: true, // Avtomatik type conversion
    }),
  );

  // CORS ni yoqish (agar frontend boshqa portda bo'lsa)
  app.enableCors();

  // Global prefix - barcha route larga prefix qo'shish
  app.setGlobalPrefix('api');

  // Portni belgilash
  const port = process.env.PORT || 3000;

  // Ilovani ishga tushirish
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(
    `📝 Game endpoint: POST http://localhost:${port}/api/game/{gameId}`,
  );
}

// Ilovani ishga tushirish
void bootstrap();
