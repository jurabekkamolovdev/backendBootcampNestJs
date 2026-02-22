import { Module } from '@nestjs/common';
import { GameServiceImpl } from './service/game.service.impl';
import { DatasourceModule } from '../../datasource/game/datasource.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatasourceModule, UserModule],
  providers: [
    {
      provide: 'IGameService',
      useClass: GameServiceImpl,
    },
  ],
  exports: ['IGameService'],
})
export class DomainModule {}
