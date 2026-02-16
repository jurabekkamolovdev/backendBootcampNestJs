import { Module } from '@nestjs/common';
import { GameStorage } from './storage/game.storage';
import { GameDataMapper } from './mapper/game-data.mapper';
import { GameRepositoryImpl } from './repository/game.repository.impl';

@Module({
  providers: [
    GameStorage,
    GameDataMapper,
    {
      provide: 'IGameRepository',
      useClass: GameRepositoryImpl,
    },
  ],

  exports: ['IGameRepository'],
})
export class DatasourceModule {}
