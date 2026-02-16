export class GameResponseDto {
  uuid: string;
  board: number[][];

  constructor(uuid: string, board: number[][]) {
    this.uuid = uuid;
    this.board = board;
  }
}
