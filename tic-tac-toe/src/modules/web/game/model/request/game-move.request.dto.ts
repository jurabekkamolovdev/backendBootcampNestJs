import { IsEnum, IsArray } from 'class-validator';
import { GameMod } from '../../../../domain/game/model/game.model';

export class GameRequest {
  @IsEnum(GameMod)
  mode: GameMod;

  @IsArray()
  board: number[][];
}
