import { User } from '../model/user.model';
import { Game } from '../../game/model/game.model';
import { JwtPayload } from 'src/modules/infrastructure/jwt/jwt.strategy';

export interface IUserService {
  signUpUser(login: string, password: string): Promise<boolean>;

  signInUser(
    authHeader: string,
  ): Promise<{ access_token: string; refresh_token: string }>;

  getUserByUuid(userUuid: string): Promise<User | null>;

  refreshTokens(
    payload: JwtPayload,
  ): Promise<{ access_token: string; refresh_token: string }>;

  getLeaderboard(
    limit: number,
  ): Promise<Array<{ playerUuid: string; winRatio: number }> | null>;

  saveGameResult(game: Game): Promise<void>;
}

export const USER_SERVICE = Symbol('USER_SERVICE');
