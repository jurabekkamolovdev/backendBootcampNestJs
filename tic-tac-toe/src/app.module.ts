import { Module } from '@nestjs/common';
import { WebModule } from './modules/web/web.module';

/**
 * App Module
 * Global modul - barcha modullarni ro'yxatdan o'tkazadi
 *
 * Arxitektura qatlamlari:
 * 1. Web Layer (WebModule) - HTTP so'rovlarni qabul qiladi
 * 2. Domain Layer (DomainModule) - biznes logikani amalga oshiradi
 * 3. Datasource Layer (DatasourceModule) - ma'lumotlar bilan ishlaydi
 *
 * Dependency Injection:
 * WebModule -> DomainModule -> DatasourceModule
 *
 * Har bir modul o'z bog'liqliklarini import qiladi:
 * - WebModule imports DomainModule
 * - DomainModule imports DatasourceModule
 */
@Module({
  imports: [
    WebModule, // Faqat Web modulini import qilamiz
    // WebModule ichida DomainModule import qilingan
    // DomainModule ichida DatasourceModule import qilingan
  ],
})
export class AppModule {}
