import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AppJwtModule } from './jwt/jwt.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AppJwtModule],
  exports: [AppConfigModule, DatabaseModule, AppJwtModule],
})
export class InfrastructureModule {}
