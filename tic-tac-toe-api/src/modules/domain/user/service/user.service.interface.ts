import { CreateUserResult } from '../model/user-result';

export interface IUserService {
  createUser(login: string, password: string): Promise<CreateUserResult>;
}

export const USER_SERVICE = Symbol('USER_SERVICE');
