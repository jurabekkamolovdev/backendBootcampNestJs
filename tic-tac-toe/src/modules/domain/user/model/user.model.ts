import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import { UserPayload } from '../service/user.service.interface';

export class User {
  private readonly id: string;
  private readonly login: string;
  private readonly password: string;

  constructor(id: string, login: string, password: string) {
    this.id = id;
    this.login = login;
    this.password = password;
  }
  getId(): string {
    return this.id;
  }

  getLogin(): string {
    return this.login;
  }

  getPassword(): string {
    return this.password;
  }

  async verifyPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  static async create(data: UserPayload): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 12);
    const id = uuid4();

    return new User(id, data.login, hashPassword);
  }

  static restore(id: string, login: string, password: string) {
    return new User(id, login, password);
  }
}
