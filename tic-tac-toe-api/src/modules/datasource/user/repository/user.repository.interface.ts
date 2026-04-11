import { User } from 'src/modules/domain/user/model/user.model';

export interface IUserRepository {
  save(domainUser: User): Promise<boolean>;

  // update(domainUser: User): boolean;

  findByUuid(userUuid: string): Promise<User | null>;

  findByLogin(userLogin: string): Promise<User | null>;

  getLeaderboard(
    limit: number,
  ): Promise<Array<{ playerUuid: string; winRatio: number }> | null>;

  incrementWinAndLoss(
    winnerPlayerUuid: string,
    lossesPlayerUuid: string,
  ): Promise<void>;

  incrementDraws(playerUuid1: string, playerUuid2: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
