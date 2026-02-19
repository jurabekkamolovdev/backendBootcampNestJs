import { User } from '../model/user.model';

export interface IUserService {
  create(data: UserPayload): Promise<User>;

  // getUserById(id: string): Promise<User>;
}

export interface UserPayload {
  login: string;
  password: string;
}
