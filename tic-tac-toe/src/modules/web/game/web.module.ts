import { Module } from '@nestjs/common';
import { GameController } from './controller/game.controller';
import { GameWebMapper } from './mapper/game-web.mapper';
import { DomainModule } from '../../domain/game/domain.module';

@Module({
  providers: [GameWebMapper],
  controllers: [GameController],
  imports: [DomainModule],
})
export class WebModule {}
