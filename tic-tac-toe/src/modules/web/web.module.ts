import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { GameController } from './controller/game.controller';
import { GameWebMapper } from './mapper/game-web.mapper';

/**
 * Web Module
 * Contains web layer components (controllers, DTOs, mappers)
 *
 * DomainModule ni import qiladi (IGameService uchun)
 */
@Module({
  imports: [DomainModule], // IGameService uchun
  controllers: [GameController],
  providers: [GameWebMapper],
})
export class WebModule {}
