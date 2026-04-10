import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildJwtOptions } from '../config/jwt.config';
import { JwtAuthGuard, JwtRefreshGuard } from './jwt-auth.guard';
import { JwtStrategy, JwtRefreshStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildJwtOptions(config),
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, JwtAuthGuard, JwtRefreshGuard],
  exports: [JwtModule, JwtAuthGuard, JwtRefreshGuard],
})
export class AppJwtModule {}
