import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameDataMapper } from './mapper/game-data.mapper';
import { GameEntity } from './model/game.entity';
import { GAMES_REPOSITORY } from './repository/game.repository.interface';
import { GameRepositoryImpl } from './repository/game.repository.impl';

@Module({
  imports: [SequelizeModule.forFeature([GameEntity])],
  providers: [
    GameDataMapper,
    {
      provide: GAMES_REPOSITORY,
      useClass: GameRepositoryImpl,
    },
  ],
  exports: [GAMES_REPOSITORY],
})
export class DatasourceModule {}
