import type { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export function buildJwtOptions(config: ConfigService): JwtModuleOptions {
  return {
    secret: config.get<string>('JWT_SECRET', '123654'),
    signOptions: {
      expiresIn: config.get<StringValue>('JWT_EXPIRES_IN', '15m'),
    },
  };
}
