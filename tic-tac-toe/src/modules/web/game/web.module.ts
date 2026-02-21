import { Module } from '@nestjs/common';
import { GameController } from './controller/game.controller';
import { GameWebMapper } from './mapper/game-web.mapper';
import { DomainModule } from '../../domain/game/domain.module';
import { UserModule } from '../../domain/user/user.module';

@Module({
  providers: [GameWebMapper],
  controllers: [GameController],
  imports: [DomainModule, UserModule],
})
export class WebModule {}
