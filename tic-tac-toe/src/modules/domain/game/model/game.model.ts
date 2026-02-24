import { GameBoard } from './game-board.model';
import { User } from '../../user/model/user.model';
import { v4 as uuid4 } from 'uuid';

export class Game {
  private readonly id: string;
  private board: GameBoard;
  private playerX: User | null;
  private playerO: User | null;
  private status: GameStatus;
  private currentPlayer: {
    id: string | null;
    role: PlayerRole;
  };
  private winnerUser: User | null;
  private readonly mode: GameMod;
  constructor(user: User, mode: GameMod, gameBoard?: GameBoard, id?: string) {
    this.playerX = user;
    this.mode = mode;
    this.board = gameBoard || new GameBoard();
    this.status = GameStatus.WAITING;
    this.id = id ? id : uuid4();
    this.currentPlayer = {
      id: this.playerX.getId(),
      role: PlayerRole.X,
    };
  }

  setCurrentPlayer(id: string | null, role: PlayerRole): void {
    this.currentPlayer = {
      id: id,
      role: role,
    };
  }

  getCurrentPlayerId() {
    return this.currentPlayer.id;
  }

  getCurrentPlayerRole() {
    return this.currentPlayer.role;
  }

  getRole() {
    return this.currentPlayer.role === PlayerRole.X ? 1 : 2;
  }

  getId(): string {
    return this.id;
  }

  getBoard(): GameBoard {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  getPlayerX() {
    return this.playerX;
  }

  getPlayerO() {
    return this.playerO;
  }

  setGameStatus(status: GameStatus) {
    this.status = status;
  }

  switchPlayer() {
    if (this.currentPlayer.id === this.playerX?.getId()) {
      this.currentPlayer.id = this.playerO?.getId() ?? null;
      this.currentPlayer.role = PlayerRole.O;
    } else {
      this.currentPlayer.id = this.playerX?.getId() ?? null;
      this.currentPlayer.role = PlayerRole.X;
    }
  }

  getWinnerUser() {
    return this.winnerUser;
  }

  getMode() {
    return this.mode;
  }

  setPlayerO(user: User) {
    this.playerO = user;
  }

  setStatus(status: GameStatus) {
    this.status = status;
  }

  setBoard(board: GameBoard) {
    this.board = board;
  }
}

export enum GameStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  DRAW = 'DRAW',
  WIN = 'WIN',
}

export enum GameMod {
  USER = 'USER',
  COMPUTER = 'COMPUTER',
}

export enum PlayerRole {
  X = 'X',
  O = 'O',
}

export interface IGame {
  gameId: string;
  board: GameBoard;
  playerIdX: string | null;
  playerIdO: string | null;
  status: GameStatus;
  currentPlayer: {
    id: string | null;
    role: PlayerRole;
  };
  winnerUser: User | string | null;
  mode: GameMod;
}
