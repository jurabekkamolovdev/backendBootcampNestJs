import { Injectable } from '@nestjs/common';
import { User } from '../model/user.model';
import { IUserService, UserPayload } from './user.service.interface';

@Injectable()
export class UserServiceImpl implements IUserService {
  async create(data: UserPayload): Promise<User> {
    const user = await User.create(data);
    return user;
  }
}
