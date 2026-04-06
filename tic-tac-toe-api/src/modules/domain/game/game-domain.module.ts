import { Module } from '@nestjs/common';
import { DatasourceModule } from 'src/modules/datasource/game/datasource.module';
import { GAME_SERVICE } from './service/game.service.interface';
import { GameServiceImpl } from './service/game.service.impl';

@Module({
  imports: [DatasourceModule],
  providers: [
    {
      provide: GAME_SERVICE,
      useClass: GameServiceImpl,
    },
  ],
  exports: [GAME_SERVICE],
})
export class GameDomainModule {}
