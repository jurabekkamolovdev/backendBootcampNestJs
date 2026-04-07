import { Module } from '@nestjs/common';
import { GameDomainModule } from 'src/modules/domain/game/game-domain.module';
import { GameController } from './controller/game.controller';
import { AppJwtModule } from 'src/modules/infrastructure/jwt/jwt.module';

@Module({
  imports: [GameDomainModule, AppJwtModule],
  controllers: [GameController],
})
export class GameControllerModule {}
