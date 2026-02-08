import { Module } from '@nestjs/common';
import { GameServiceImpl } from './service/game.service.impl';

/**
 * Domain Module
 * Contains business logic and domain models
 */
@Module({
  providers: [
    {
      provide: 'IGameService',
      useClass: GameServiceImpl,
    },
  ],
  exports: ['IGameService'],
})
export class DomainModule {}