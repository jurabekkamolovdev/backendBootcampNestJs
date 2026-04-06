import { Injectable, Inject } from '@nestjs/common';
import { type IUserService } from './user.service.interface';
import { User } from '../model/user.model';
import { CreateUserResult } from '../model/user-result';
import {
  type IUserRepositoryMap,
  USER_REPOSITORY_MAP,
} from 'src/modules/datasource/user/repository/Map/user-map.repository.interface';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY_MAP)
    private readonly userRepositoryMap: IUserRepositoryMap,
  ) {}

  async createUser(login: string, password: string): Promise<CreateUserResult> {
    const user = await User.createUser(login, password);
    this.userRepositoryMap.save(user);
    return {
      userUuid: user.getUuid(),
      login: user.getLogin(),
    };
  }
}
