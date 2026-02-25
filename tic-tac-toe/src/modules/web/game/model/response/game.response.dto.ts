export class GameResponseDto {
  uuid: string;
  board: number[][];
  playerXId: string | null;
  playerOId: string | null;
  currentPlayerId: string | null;
  gameStatus: string | null;
  winnerId: string | null;

  constructor(
    uuid: string,
    board: number[][],
    playerXId: string | null,
    player0Id: string | null,
    currentPlayerId: string | null,
    gameStatus: string | null,
    winnerId: string | null,
  ) {
    this.uuid = uuid;
    this.board = board;
    this.playerXId = playerXId;
    this.playerOId = player0Id;
    this.currentPlayerId = currentPlayerId;
    this.gameStatus = gameStatus;
    this.winnerId = winnerId;
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
      gameStatus: this.gameStatus,
      winnerId: this.winnerId,
    };
  }
}

export class GameListItemResponseDto {
  gameId: string;
  playerXId: string | null;
  status: string;
  mode: string;

  constructor(
    gameId: string,
    playerXId: string | null,
    status: string,
    mode: string,
  ) {
    this.gameId = gameId;
    this.playerXId = playerXId;
    this.status = status;
    this.mode = mode;
  }
}
