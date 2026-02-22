import { User } from '../../../domain/user/model/user.model';

export interface IUserRepository {
  save(user: User): Promise<User>;

  findByLogin(login: string): Promise<User>;

  findById(uuid: string): Promise<User | null>;
}
