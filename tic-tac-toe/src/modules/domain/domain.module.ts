import { Module } from '@nestjs/common';
import { GameServiceImpl } from './service/game.service.impl';
import { DatasourceModule } from '../datasource/datasource.module';

/**
 * Domain Module
 * Contains business logic and domain models
 *
 * DatasourceModule ni import qiladi (repository uchun)
 */
@Module({
  imports: [DatasourceModule], // Repository uchun
  providers: [
    {
      provide: 'IGameService',
      useClass: GameServiceImpl,
    },
  ],
  exports: ['IGameService'],
})
export class DomainModule {}
