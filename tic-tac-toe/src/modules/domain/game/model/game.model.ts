import { GameBoard } from './game-board.model';

export class Game {
  private readonly id: string;
  private board: GameBoard;

  constructor(id: string, gameBoard?: GameBoard) {
    this.id = id;
    this.board = gameBoard || new GameBoard();
  }

  getId(): string {
    return this.id;
  }

  getBoard(): GameBoard {
    return this.board;
  }

  setBoard(board: GameBoard) {
    this.board = board;
  }

  clone(): Game {
    return new Game(this.id, this.board.clone());
  }
}
