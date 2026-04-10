import { randomUUID } from 'crypto';
import { GameBoard } from './game-board.model';

export class Game {
  private readonly gameUuid: string;
  private readonly gameCreatedAt: Date;
  private readonly gameBoard: GameBoard;
  private readonly opponent: Opponent;
  private gameState: GameState;
  private playerX?: Player;
  private playerO?: Player;

  constructor(
    board: GameBoard,
    opponent: Opponent,
    uuid?: string,
    createdAt?: Date,
  ) {
    this.gameUuid = uuid ?? randomUUID();
    this.gameCreatedAt = createdAt ?? new Date();
    this.gameBoard = board;
    this.opponent = opponent;
    this.gameState = { status: 'wait' };
  }

  // ─── GETTERS ─────────────────────────────────────────────────────────────────

  getGameUuid(): string {
    return this.gameUuid;
  }

  getOpponent(): Opponent {
    return this.opponent;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getBoard(): number[][] {
    return this.gameBoard.getBoard();
  }

  getPlayerX(): Player | undefined {
    return this.playerX;
  }

  getPlayerO(): Player | undefined {
    return this.playerO;
  }

  getCreatedAt(): Date {
    return this.gameCreatedAt;
  }

  // ─── SETTERS ─────────────────────────────────────────────────────────────────

  setState(state: GameState): void {
    this.gameState = state;
  }

  setPlayerX(player: Player): void {
    this.playerX = player;
  }

  setPlayerO(player: Player): void {
    this.playerO = player;
  }

  setNewCell(move: { row: number; col: number; newCell: number }): void {
    this.gameBoard.setCell(move.row, move.col, move.newCell);
  }

  // ─── O'YIN HOLATI ─────────────────────────────────────────────────────────────

  /**
   * O'yinni boshlaydi. PlayerX (1-raqam) har doim birinchi yuradi.
   * VS Computer: darhol 'game' holatiga o'tadi.
   * VS Player  : ikkala o'yinchi bo'lmaguncha 'wait' turadi.
   */
  startGame(): void {
    if (this.opponent === 'computer') {
      this.gameState = { status: 'game', currentPlayer: this.playerX };
      return;
    }

    // VS player: ikkala joy to'lganmi?
    if (this.playerX && this.playerO) {
      this.gameState = { status: 'game', currentPlayer: this.playerX };
    } else {
      this.gameState = { status: 'wait' };
    }
  }

  /**
   * Navbatni keyingi o'yinchiga o'tkazadi.
   */
  switchPlayer(): void {
    if (this.gameState.status !== 'game') return;

    const current = this.gameState.currentPlayer;
    if (!current) throw new Error("switchPlayer: currentPlayer yo'q");

    const next =
      this.playerO?.uuid === current.uuid ? this.playerX : this.playerO;

    if (!next) throw new Error("switchPlayer: keyingi o'yinchi topilmadi");

    this.gameState = { status: 'game', currentPlayer: next };
  }

  // ─── O'YIN LOGIKASI ───────────────────────────────────────────────────────────

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

  /**
   * Yangi board bilan eski boardni solishtiradi.
   * Faqat bitta katak o'zgargan bo'lsa, shu o'zgarishni qaytaradi.
   */
  validateGameBoard(
    newGameBoard: GameBoard,
  ): { row: number; col: number; newCell: number } | null {
    if (this.gameBoard.getSize() !== newGameBoard.getSize()) {
      throw new Error(
        `Board o'lchami mos emas: ${this.gameBoard.getSize()} vs ${newGameBoard.getSize()}`,
      );
    }

    let move: { row: number; col: number; newCell: number } | null = null;
    let changedCount = 0;
    const size = this.gameBoard.getSize();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const old = this.gameBoard.getCell(i, j);
        const next = newGameBoard.getCell(i, j);

        if (old === next) continue;

        if (old !== 0) {
          throw new Error(`(${i},${j}) katak allaqachon band`);
        }

        if (next === 0) {
          throw new Error(`Katakni bo'shatib bo'lmaydi`);
        }

        changedCount++;
        move = { row: i, col: j, newCell: next };

        if (changedCount > 1) return null;
      }
    }

    return changedCount === 0 ? null : move;
  }

  // ─── MINIMAX ─────────────────────────────────────────────────────────────────

  getBestMove(): { row: number; col: number; newCell: number } | null {
    const computer = this.playerX?.uuid === 'computer' ? 1 : 2;
    const player = computer === 1 ? 2 : 1;
    const size = this.gameBoard.getSize();

    let bestScore = -Infinity;
    let bestMove: { row: number; col: number; newCell: number } | null = null;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!this.gameBoard.isEmpty(i, j)) continue;

        const cloned = this.gameBoard.clone();
        cloned.setCell(i, j, computer);

        const score = this.minimax(cloned, 0, false, computer, player);

        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: i, col: j, newCell: computer };
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
      let best = -Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (!board.isEmpty(i, j)) continue;
          const cloned = board.clone();
          cloned.setCell(i, j, computerValue);
          best = Math.max(
            best,
            this.minimax(cloned, depth + 1, false, computerValue, playerValue),
          );
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (!board.isEmpty(i, j)) continue;
          const cloned = board.clone();
          cloned.setCell(i, j, playerValue);
          best = Math.min(
            best,
            this.minimax(cloned, depth + 1, true, computerValue, playerValue),
          );
        }
      }
      return best;
    }
  }
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Opponent = 'player' | 'computer';

export type GameState =
  | { status: 'wait' }
  | { status: 'game'; currentPlayer?: Player }
  | { status: 'draw' }
  | { status: 'win'; winnerPlayer: Player };

export interface Player {
  uuid: string;
  state: 1 | 2;
}
