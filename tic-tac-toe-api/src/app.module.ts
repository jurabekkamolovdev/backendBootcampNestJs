import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { GameControllerModule } from './modules/web/game/game-web.module';
import { UserControllerModule } from './modules/web/user/user-web.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule, GameControllerModule, UserControllerModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
