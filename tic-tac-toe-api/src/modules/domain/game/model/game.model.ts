import { randomUUID } from 'crypto';
import { GameBoard } from './game-board.model';

export class Game {
  private readonly gameUuid: string;
  private readonly gameBoard: GameBoard;
  private readonly opponent: Opponent;
  private gameState: GameState;
  private playerX?: Player;
  private playerO?: Player;

  constructor(board: GameBoard, opponent: Opponent, uuid?: string) {
    this.gameUuid = uuid ? uuid : randomUUID();
    this.gameBoard = board;
    this.opponent = opponent;
    this.gameState = { status: 'wait' };
  }

  getOpponent(): Opponent {
    return this.opponent;
  }

  getGameUuid(): string {
    return this.gameUuid;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getBoard(): number[][] {
    return this.gameBoard.getBoard();
  }

  setState(state: GameState) {
    this.gameState = state;
  }

  setPlayerX(player: Player): void {
    this.playerX = player;
  }

  getPlayerX(): Player | undefined {
    return this.playerX;
  }

  switchPlayer() {
    if (this.gameState.status === 'game') {
      const currentPlayer: Player | undefined = this.gameState.currentPlayer;

      if (!currentPlayer) throw new Error('Switch Player');

      const nextCurrentPlayer: Player | undefined =
        this.playerO?.uuid === currentPlayer.uuid ? this.playerX : this.playerO;

      if (!nextCurrentPlayer)
        throw new Error('Switch Player next current player');

      this.gameState = { status: 'game', currentPlayer: nextCurrentPlayer };
    }
  }

  setPlayerO(player: Player): void {
    this.playerO = player;
  }

  getPlayerO(): Player | undefined {
    return this.playerO;
  }

  startGame(): void {
    const currentPlayer = this.playerX;
    if (this.opponent === 'computer')
      this.gameState = { status: 'game', currentPlayer: currentPlayer };
  }

  setCurrentPlayer(currentPlayer: Player): void {
    this.gameState = { status: 'game', currentPlayer };
  }

  setNewCell(move: { row: number; col: number; newCell: number }) {
    this.gameBoard.setCell(move.row, move.col, move.newCell);
  }

  takeTurn(row: number, col: number, value: number): GameState {
    if (this.gameState.status === 'win' || this.gameState.status === 'draw') {
      throw new Error(`O'yin allaqachon tugagan`);
    }

    if (!this.gameBoard.isEmpty(row, col)) {
      throw new Error(`(${row}, ${col}) katagi band`);
    }

    this.gameBoard.setCell(row, col, value);

    this.checkGameOver();

    return this.gameState;
  }

  checkGameOver(): boolean {
    const winner = this.gameBoard.getWinner();

    if (winner !== null) {
      const winnerPlayer = winner === 1 ? this.playerX : this.playerO;
      if (!winnerPlayer) return false;
      this.gameState = { status: 'win', winnerPlayer };
      return true;
    }

    if (this.gameBoard.isFull()) {
      this.gameState = { status: 'draw' };
      return true;
    }

    return false;
  }

  validateGameBoard(
    newGameBoard: GameBoard,
  ): { row: number; col: number; newCell: number } | null {
    let changedCount = 0;

    if (this.gameBoard.getSize() !== newGameBoard.getSize()) {
      throw new Error(
        `O'yinda maydonlar har-xilligi: Size:${this.gameBoard.getSize()} - Size:${newGameBoard.getSize()}`,
      );
    }

    let move: { row: number; col: number; newCell: number } | null = null;

    const boardSize = this.gameBoard.getSize();
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const oldCell = this.gameBoard.getCell(i, j);
        const newCell = newGameBoard.getCell(i, j);

        if (oldCell !== newCell) {
          if (oldCell !== 0) {
            throw new Error(`(${i}, ${j}) katagi allaqachon band!`);
          }

          if (newCell === 0) {
            throw new Error(`Katakni o'chirib bo'lmaydi!`);
          }

          changedCount++;
          move = { row: i, col: j, newCell: newCell };
        }

        if (changedCount > 1) {
          return null;
        }
      }
    }

    if (changedCount === 0) return null;

    return move;
  }

  getBestMove(): { row: number; col: number; newCell: number } | null {
    let bestScore = -Infinity;
    let bestMove: { row: number; col: number; newCell: number } | null = null;

    const size = this.gameBoard.getSize();

    const computer = this.playerX?.uuid === 'computer' ? 1 : 2;
    const player = computer === 1 ? 2 : 1;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (this.gameBoard.isEmpty(i, j)) {
          const clonedBoard = this.gameBoard.clone();
          clonedBoard.setCell(i, j, computer);

          const score = this.minimax(clonedBoard, 0, false, computer, player);

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j, newCell: computer };
          }
        }
      }
    }

    return bestMove;
  }

  private minimax(
    board: GameBoard,
    depth: number,
    isMaximizing: boolean,
    computerValue: number,
    playerValue: number,
  ): number {
    const winner = board.getWinner();

    if (winner === computerValue) return 10 - depth;
    if (winner === playerValue) return depth - 10;
    if (board.isFull()) return 0;

    const size = board.getSize();

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const cloned = board.clone();
            cloned.setCell(i, j, computerValue);
            bestScore = Math.max(
              bestScore,
              this.minimax(
                cloned,
                depth + 1,
                false,
                computerValue,
                playerValue,
              ),
            );
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const cloned = board.clone();
            cloned.setCell(i, j, playerValue);
            bestScore = Math.min(
              bestScore,
              this.minimax(cloned, depth + 1, true, computerValue, playerValue),
            );
          }
        }
      }
      return bestScore;
    }
  }
}

export type Opponent = 'player' | 'computer';

export type GameState =
  | { status: 'wait'; currentPlayer?: Player }
  | { status: 'game'; currentPlayer?: Player }
  | { status: 'draw' }
  | { status: 'win'; winnerPlayer: Player };

export interface Player {
  uuid: string;
  state: 1 | 2;
}
