import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export class User {
  private uuid: string;
  private login: string;
  private passwordHash: string;

  constructor(uuid: string, login: string, passwordHash: string) {
    this.uuid = uuid;
    this.login = login;
    this.passwordHash = passwordHash;
  }

  getUuid(): string {
    return this.uuid;
  }

  getLogin(): string {
    return this.login;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  static async createUser(login: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = randomUUID();

    return new User(uuid, login, passwordHash);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
