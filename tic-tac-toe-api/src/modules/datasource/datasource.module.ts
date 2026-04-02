import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GamesRepositoryImpl } from './repository/games.repository';
import { GAMES_REPOSITORY } from './repository/games.repository.interface';
import { GameDbModel } from './model/game.db-model';

@Module({
  imports: [SequelizeModule.forFeature([GameDbModel])],
  providers: [
    GamesRepositoryImpl,
    {
      provide: GAMES_REPOSITORY,
      useClass: GamesRepositoryImpl,
    },
  ],
  exports: [GAMES_REPOSITORY],
})
export class DatasourceModule {}
