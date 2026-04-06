import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { GameController } from './controller/game.controller';

@Module({
  imports: [DomainModule],
  controllers: [GameController],
  providers: [],
  exports: [],
})
export class WebModule {}
