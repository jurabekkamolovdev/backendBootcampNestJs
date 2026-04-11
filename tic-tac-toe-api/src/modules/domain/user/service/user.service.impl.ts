import { Injectable, Inject } from '@nestjs/common';
import { type IUserService } from './user.service.interface';
import { User } from '../model/user.model';
import { ConfigService } from '@nestjs/config';
import {
  type IUserRepositoryMap,
  USER_REPOSITORY_MAP,
} from 'src/modules/datasource/user/repository/Map/user-map.repository.interface';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/datasource/user/repository/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/infrastructure/jwt/jwt.strategy';
import { Game } from '../../game/model/game.model';
import { GameState } from '../../game/model/game.model';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY_MAP)
    private readonly userRepositoryMap: IUserRepositoryMap,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUpUser(login: string, password: string): Promise<boolean> {
    // if (this.userRepositoryMap.findByLogin(login)) {
    //   throw new Error(`Bunday foydalanuvchi mavjud: ${login}`);
    // }

    const user = await User.createUser(login, password);
    await this.userRepository.save(user);
    return true;
  }

  async signInUser(
    authHeader: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const base64Credentials = authHeader.replace('Basic ', '');
    const decode = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [login, password] = decode.split(':');
    // const user: User | null = this.userRepositoryMap.findByLogin(login);

    const user: User | null = await this.userRepository.findByLogin(login);

    if (!user) {
      throw new Error(`Bunday user mavjud emas: ${login}`);
    }

    const isMatch: boolean = await user.verifyPassword(password);

    const payload: JwtPayload = {
      uuid: user.getUuid(),
      login: user.getLogin(),
    };

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return this.refreshTokens(payload);
  }

  async getUserByUuid(userUuid: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findByUuid(userUuid);

    if (!user) {
      return null;
    }

    return user;
  }

  async refreshTokens(
    payload: JwtPayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const cleanPayload: JwtPayload = {
      uuid: payload.uuid,
      login: payload.login,
    };
    return {
      access_token: await this.jwtService.signAsync(cleanPayload),
      refresh_token: await this.jwtService.signAsync(cleanPayload, {
        secret: this.config.get('JWT_REFRESH_SECRET', 'refresh_secret'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    };
  }

  async saveGameResult(game: Game): Promise<void> {
    const gameState: GameState = game.getGameState();

    if (gameState.status === 'win') {
      const winnerUuid = gameState.winnerPlayer.uuid;
      const loserUuid =
        winnerUuid === game.getPlayerX()?.uuid
          ? game.getPlayerO()?.uuid
          : game.getPlayerX()?.uuid;

      if (!loserUuid) throw new Error('Loser topilmadi');

      await this.userRepository.incrementWinAndLoss(winnerUuid, loserUuid);
    } else if (gameState.status === 'draw') {
      const player1Uuid = game.getPlayerX()?.uuid;
      const player2Uuid = game.getPlayerO()?.uuid;

      if (!player1Uuid || !player2Uuid) throw new Error('Playerlar topilmadi');

      await this.userRepository.incrementDraws(player1Uuid, player2Uuid);
    }
  }

  async getLeaderboard(
    limit: number,
  ): Promise<Array<{ playerUuid: string; winRatio: number }> | null> {
    return this.userRepository.getLeaderboard(limit);
  }
}
