export class GameResponseDto {
  uuid: string;
  board: number[][];
  playerXId: string | null;
  playerOId: string | null;
  currentPlayerId: string | null;

  constructor(
    uuid: string,
    board: number[][],
    playerXId: string | null,
    player0Id: string | null,
    currentPlayerId: string | null,
  ) {
    this.uuid = uuid;
    this.board = board;
    this.playerXId = playerXId;
    this.playerOId = player0Id;
    this.currentPlayerId = currentPlayerId;
  }

  getDataResponse() {
    return {
      gameId: this.uuid,
      board: this.board,
      players: {
        X: this.playerXId,
        O: this.playerOId,
      },
      nextMovePlayer: this.currentPlayerId,
    };
  }
}
