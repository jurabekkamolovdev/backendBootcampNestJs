import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from '../datasource/users.repository.interface';
import type { User } from './user.model';
import type { UsersService } from './users.service.interface';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repo: UsersRepository,
  ) {}

  async createUser(login: string, password: string): Promise<boolean> {
    const existing = await this.repo.findByLogin(login);
    if (existing) return false;

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = { uuid: randomUUID(), login, passwordHash };
    await this.repo.create(user);
    return true;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.repo.findByLogin(login);
  }

  async findByUuid(uuid: string): Promise<User | undefined> {
    return this.repo.findByUuid(uuid);
  }

  async validateLoginPassword(
    login: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.repo.findByLogin(login);
    if (!user) return undefined;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : undefined;
  }
}
