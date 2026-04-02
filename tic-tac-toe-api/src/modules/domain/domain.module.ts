import { Module } from '@nestjs/common';
import { DatasourceModule } from '../datasource/datasource.module';
import { GameServiceImpl } from './service/game.service.impl';
import { GAME_SERVICE } from './service/game.service.interface';

@Module({
  imports: [DatasourceModule],
  providers: [
    GameServiceImpl,
    {
      provide: GAME_SERVICE,
      useClass: GameServiceImpl,
    },
  ],
  exports: [GAME_SERVICE],
})
export class DomainModule {}
