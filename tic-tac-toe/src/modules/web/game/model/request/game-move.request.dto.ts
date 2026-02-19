import { IsArray } from 'class-validator';

export class GameMoveRequest {
  @IsArray()
  board: number[][];
}
