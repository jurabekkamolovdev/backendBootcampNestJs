import { User } from '../model/user.model';

export interface IUserService {
  create(data: UserPayload): Promise<User>;

  login(authHeader: string): Promise<{ access_token: string }>;

  getUserById(id: string): Promise<User | null>;
}

export interface UserPayload {
  login: string;
  password: string;
}
