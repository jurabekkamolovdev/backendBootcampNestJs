import type { User } from './user.model';

export const USERS_SERVICE = Symbol('USERS_SERVICE');

export interface UsersService {
  createUser(login: string, password: string): Promise<boolean>;
  findByLogin(login: string): Promise<User | undefined>;
  findByUuid(uuid: string): Promise<User | undefined>;
  validateLoginPassword(
    login: string,
    password: string,
  ): Promise<User | undefined>;
}
