import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.model';
import { IUserService, UserPayload } from './user.service.interface';
import type { IUserRepository } from '../../../datasource/user/repository/user.repository.interface';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}
  async create(data: UserPayload): Promise<User> {
    const user = await User.create(data);
    return await this.userRepository.save(user);
  }
}
