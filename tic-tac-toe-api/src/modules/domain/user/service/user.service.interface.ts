import { CreateUserResult } from '../model/user-result';

export interface IUserService {
  createUser(login: string, password: string): Promise<CreateUserResult>;

  signInUser(
    authHeader: string,
  ): Promise<{ access_token: string; uuid: string }>;
}

export const USER_SERVICE = Symbol('USER_SERVICE');
