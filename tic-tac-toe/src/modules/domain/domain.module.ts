import { Module } from '@nestjs/common';
import { GameServiceImpl } from './service/game.service.impl';
import { DatasourceModule } from '../datasource/datasource.module';

@Module({
  imports: [DatasourceModule],
  providers: [
    {
      provide: 'IGameService',
      useClass: GameServiceImpl,
    },
  ],
  exports: ['IGameService'],
})
export class DomainModule {}
