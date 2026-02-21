import { GameBoard } from './game-board.model';
import { User } from '../../user/model/user.model';
import { v4 as uuid4 } from 'uuid';

export class Game {
  private readonly id: string;
  private board: GameBoard;
  private playerX: User | null;
  private player0: User | null;
  private status: GameStatus;
  private currentPlayer: User | null;
  private winnerUser: User | null;
  private mode: GameMod;

  constructor(user: User, mode: GameMod, gameBoard?: GameBoard) {
    this.playerX = user;
    this.mode = mode;
    this.board = gameBoard || new GameBoard();
    this.status = GameStatus.WAITING;
    this.id = uuid4();
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

  getPlayer0() {
    return this.player0;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getWinnerUser() {
    return this.winnerUser;
  }

  getMode() {
    return this.mode;
  }

  setBoard(board: GameBoard) {
    this.board = board;
  }

  // clone(): Game {
  //   return new Game(this.id, this.board.clone());
  // }
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
