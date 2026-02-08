import { Module } from '@nestjs/common';
import { GameStorage } from './storage/game.storage';
import { GameDataMapper } from './mapper/game-data.mapper';
import { GameRepositoryImpl } from './repository/game.repository.impl';

/**
 * Datasource Module
 * Contains data access layer components
 *
 * Bu - ma'lumotlar bazasi bilan ishlash qatlami
 */
@Module({
  providers: [
    GameStorage, // Storage klassi
    GameDataMapper, // Mapper klassi
    {
      provide: 'IGameRepository', // Token
      useClass: GameRepositoryImpl, // Repository implementatsiyasi
    },
  ],
  exports: [
    'IGameRepository', // Boshqa modullarga export qilish
  ],
})
export class DatasourceModule {}
