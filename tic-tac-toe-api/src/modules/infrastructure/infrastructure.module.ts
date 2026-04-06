// src/infrastructure/infrastructure.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  exports: [AppConfigModule, DatabaseModule],
})
export class InfrastructureModule {}
