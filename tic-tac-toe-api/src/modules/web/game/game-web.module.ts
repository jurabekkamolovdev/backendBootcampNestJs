import { Module } from '@nestjs/common';
import { GameDomainModule } from 'src/modules/domain/game/game-domain.module';
import { GameController } from './controller/game.controller';

@Module({
  imports: [GameDomainModule],
  controllers: [GameController],
})
export class GameControllerModule {}
