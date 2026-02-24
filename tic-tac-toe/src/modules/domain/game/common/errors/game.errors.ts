// game/errors/game.errors.ts
import { AppError } from './app.error';
import { GameErrorCode } from './game.error-codes.enum';

export class GameNotFoundError extends AppError {
  constructor(gameId: string) {
    super(
      GameErrorCode.GAME_NOT_FOUND,
      `Game with id "${gameId}" was not found`,
      404,
    );
  }
}

// export class GameDomainConvertError extends AppError {
//   constructor(gameId: string) {
//     super(
//       GameErrorCode.GAME_DOMAIN_CONVERT_FAILED,
//       `Failed to convert game "${gameId}" to domain model`,
//       500,
//     );
//   }
// }

export class GameNotYourTurnError extends AppError {
  constructor(playerId: string) {
    super(
      GameErrorCode.GAME_NOT_YOUR_TURN,
      `It is not your turn, player "${playerId}"`,
      403,
    );
  }
}

export class GameInvalidMoveError extends AppError {
  constructor() {
    super(
      GameErrorCode.GAME_INVALID_MOVE,
      `The move is invalid. You can only change one empty cell with your role`,
      400,
    );
  }
}

export class GameAlreadyStartedError extends AppError {
  constructor(gameId: string) {
    super(
      GameErrorCode.GAME_ALREADY_STARTED,
      `Game "${gameId}" has already started, player O is already assigned`,
      409,
    );
  }
}

export class GamePlayerNotFoundError extends AppError {
  constructor(playerId: string | null) {
    super(
      GameErrorCode.GAME_PLAYER_NOT_FOUND,
      `Player with id "${playerId}" was not found`,
      404,
    );
  }
}

export class GameMissingPlayerXError extends AppError {
  constructor(gameId: string) {
    super(
      GameErrorCode.GAME_MISSING_PLAYER_X,
      `Game "${gameId}" is missing player X`,
      400,
    );
  }
}

export class GameMissingPlayerOError extends AppError {
  constructor(gameId: string) {
    super(
      GameErrorCode.GAME_MISSING_PLAYER_O,
      `Game "${gameId}" is missing player O`,
      400,
    );
  }
}
