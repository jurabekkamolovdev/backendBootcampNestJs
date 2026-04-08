import { User } from 'src/modules/domain/user/model/user.model';

export interface IUserRepository {
  save(domainUser: User): Promise<boolean>;

  // update(domainUser: User): boolean;

  findByUuid(userUuid: string): Promise<User | null>;

  findByLogin(userLogin: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
