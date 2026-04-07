import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameDataMapper } from './mapper/game-data.mapper';
import { GameEntity } from './model/game.entity';
import { GAMES_REPOSITORY } from './repository/game.repository.interface';
import { GAMES_REPOSITORY_MAP } from './repository/Map/game-map.repository.interface';
import { GameRepositoryImpl } from './repository/game.repository.impl';
import { GameRepositoryMapImpl } from './repository/Map/game-map.repository.impl';

@Module({
  imports: [SequelizeModule.forFeature([GameEntity])],
  providers: [
    GameDataMapper,
    {
      provide: GAMES_REPOSITORY,
      useClass: GameRepositoryImpl,
    },
    {
      provide: GAMES_REPOSITORY_MAP,
      useClass: GameRepositoryMapImpl,
    },
  ],
  exports: [GAMES_REPOSITORY, GAMES_REPOSITORY_MAP],
})
export class DatasourceModule {}
