import { User } from 'src/modules/domain/user/model/user.model';

export interface IUserRepositoryMap {
  save(domainUser: User): boolean;

  update(domainUser: User): boolean;

  findById(userUuid: string): User | null;
}

export const USER_REPOSITORY_MAP = Symbol('USER_REPOSITORY_MAP');
