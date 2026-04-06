import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebModule } from './modules/web/web.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AuthModule,
    WebModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
