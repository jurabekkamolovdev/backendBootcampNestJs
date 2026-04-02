import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { GameBoard } from '../model/game-board.model';
import type { Game, GameState } from '../model/game.model';
import {
  GAMES_REPOSITORY,
  type GamesRepository,
} from '../../datasource/repository/games.repository.interface';
import {
  applyComputerMove,
  assertValidSubmittedBoardShape,
  EMPTY,
  getWinnerCell,
} from './game-rules';
import type { GameService } from './game.service.interface';

@Injectable()
export class GameServiceImpl implements GameService {
  constructor(
    @Inject(GAMES_REPOSITORY) private readonly gamesRepo: GamesRepository,
  ) {}

  async createGame(
    creatorUuid: string,
    opponent: 'computer' | 'user',
  ): Promise<Game> {
    const vsComputer = opponent === 'computer';
    const uuid = randomUUID();
    const state: GameState = vsComputer
      ? { kind: 'turn', userUuid: creatorUuid }
      : { kind: 'waiting_for_players' };

    const game: Game = {
      uuid,
      board: emptyBoard(),
      playerXUuid: creatorUuid,
      playerOUuid: undefined,
      vsComputer,
      state,
    };

    await this.gamesRepo.save(game);
    return game;
  }

  async listAvailableGames(): Promise<Game[]> {
    return this.gamesRepo.listWaitingForPlayers();
  }

  async joinGame(gameUuid: string, joinerUuid: string): Promise<Game> {
    const existing = await this.gamesRepo.get(gameUuid);
    if (!existing) throw new NotFoundException('Game not found');
    if (existing.vsComputer)
      throw new BadRequestException('Cannot join vs computer game');
    if (existing.playerOUuid)
      throw new ConflictException('Game already has two players');
    if (existing.playerXUuid === joinerUuid)
      throw new ConflictException('Cannot join your own game');

    const updated: Game = {
      ...existing,
      playerOUuid: joinerUuid,
      state: { kind: 'turn', userUuid: existing.playerXUuid },
    };
    await this.gamesRepo.save(updated);
    return updated;
  }

  async getGame(gameUuid: string): Promise<Game> {
    const game = await this.gamesRepo.get(gameUuid);
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async makeMove(
    gameUuid: string,
    userUuid: string,
    row: number,
    col: number,
  ): Promise<Game> {
    const game = await this.gamesRepo.get(gameUuid);
    if (!game) throw new NotFoundException('Game not found');

    if (game.state.kind === 'waiting_for_players') {
      throw new ConflictException('Waiting for players');
    }
    if (game.state.kind === 'draw' || game.state.kind === 'win') {
      throw new ConflictException('Game already finished');
    }
    if (game.state.userUuid !== userUuid) {
      throw new ConflictException('Not your turn');
    }

    const symbol = resolveSymbol(game, userUuid);
    const nextBoard = applyMove(game.board, row, col, symbol);

    // PvE: after X plays, computer (O) plays automatically.
    const boardAfterOpponent =
      game.vsComputer && symbol === 1
        ? applyComputerMove(nextBoard)
        : nextBoard;

    const nextState = computeNextState(
      game,
      boardAfterOpponent,
      userUuid,
      symbol,
    );

    const updated: Game = {
      ...game,
      board: boardAfterOpponent,
      state: nextState,
    };

    await this.gamesRepo.save(updated);
    return updated;
  }
}

function emptyBoard(): GameBoard {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function applyMove(
  board: GameBoard,
  row: number,
  col: number,
  symbol: 1 | 2,
): GameBoard {
  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    throw new BadRequestException('Invalid move coordinates');
  }
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    throw new BadRequestException('Invalid move coordinates');
  }
  if (board[row][col] !== EMPTY) {
    throw new ConflictException('Cell is not empty');
  }
  const next = board.map((r) => r.slice()) as GameBoard;
  next[row][col] = symbol;
  assertValidSubmittedBoardShape(next);
  return next;
}

function resolveSymbol(game: Game, userUuid: string): 1 | 2 {
  if (userUuid === game.playerXUuid) return 1;
  if (!game.vsComputer && userUuid === game.playerOUuid) return 2;
  if (game.vsComputer) return 1;
  throw new ConflictException('User is not part of this game');
}

function computeNextState(
  game: Game,
  board: GameBoard,
  currentUserUuid: string,
  currentSymbol: 1 | 2,
): GameState {
  const winner = getWinnerCell(board);
  if (winner === 1) return { kind: 'win', userUuid: game.playerXUuid };
  if (winner === 2) {
    if (game.vsComputer) return { kind: 'win', userUuid: 'computer' };
    if (!game.playerOUuid) return { kind: 'waiting_for_players' };
    return { kind: 'win', userUuid: game.playerOUuid };
  }
  const isFull = board.every((r) => r.every((c) => c !== 0));
  if (isFull) return { kind: 'draw' };

  if (game.vsComputer) {
    return { kind: 'turn', userUuid: game.playerXUuid };
  }
  if (!game.playerOUuid) return { kind: 'waiting_for_players' };

  const nextTurn = currentSymbol === 1 ? game.playerOUuid : game.playerXUuid;
  return { kind: 'turn', userUuid: nextTurn };
}
