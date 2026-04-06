import type { SequelizeModuleOptions } from '@nestjs/sequelize';
import type { ConfigService } from '@nestjs/config';

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
}

export function buildSequelizeOptions(
  config: ConfigService,
): SequelizeModuleOptions {
  const dialect = config.get<string>('DB_DIALECT', 'postgres') as 'postgres';

  return {
    dialect,
    host: config.get<string>('DB_HOST', 'localhost'),
    port: Number(config.get<string>('DB_PORT', '5432')),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', ''),
    database: config.get<string>('DB_NAME', 'tic-tac-toe'),
    autoLoadModels: readBool(config.get<string>('DB_AUTOLOAD_MODELS'), true),
    synchronize: readBool(config.get<string>('DB_SYNCHRONIZE'), true),
    logging: false,
  };
}
