import type { User } from '../domain/user.model';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository {
  findByLogin(login: string): Promise<User | undefined>;
  findByUuid(uuid: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
