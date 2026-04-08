import { CreateUserResult } from '../model/user-result';
import { User } from '../model/user.model';

export interface IUserService {
  createUser(login: string, password: string): Promise<CreateUserResult>;

  signInUser(
    authHeader: string,
  ): Promise<{ access_token: string; uuid: string }>;

  getUserByUuid(userUuid: string): Promise<User | null>;
}

export const USER_SERVICE = Symbol('USER_SERVICE');
