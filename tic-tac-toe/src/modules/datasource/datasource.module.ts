import { Module } from '@nestjs/common';
import { GameDataMapper } from './mapper/game-data.mapper';
import { GameRepositoryImpl } from './repository/game.repository.impl';
import { GameModel } from './model/game.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([GameModel])],
  providers: [
    // GameStorage,
    GameDataMapper,
    {
      provide: 'IGameRepository',
      useClass: GameRepositoryImpl,
    },
  ],

  exports: ['IGameRepository'],
})
export class DatasourceModule {}
