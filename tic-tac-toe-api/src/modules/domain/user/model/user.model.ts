import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export class User {
  private uuid: string;
  private login: string;
  private passwordHash: string;

  private wins: number;
  private draws: number;
  private losses: number;

  constructor(
    uuid: string,
    login: string,
    passwordHash: string,
    wins?: number,
    draws?: number,
    losses?: number,
  ) {
    this.uuid = uuid;
    this.login = login;
    this.passwordHash = passwordHash;

    this.wins = wins ?? 0;
    this.draws = draws ?? 0;
    this.losses = losses ?? 0;
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

  getWins(): number {
    return this.wins;
  }

  getDraws(): number {
    return this.draws;
  }

  getLosses(): number {
    return this.losses;
  }

  setWins(value: number) {
    this.wins = value;
  }

  setDraws(value: number) {
    this.draws = value;
  }

  setLosses(value: number) {
    this.losses = value;
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
