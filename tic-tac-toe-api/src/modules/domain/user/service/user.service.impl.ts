import { Injectable, Inject } from '@nestjs/common';
import { type IUserService } from './user.service.interface';
import { User } from '../model/user.model';
import { CreateUserResult } from '../model/user-result';
import {
  type IUserRepositoryMap,
  USER_REPOSITORY_MAP,
} from 'src/modules/datasource/user/repository/Map/user-map.repository.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY_MAP)
    private readonly userRepositoryMap: IUserRepositoryMap,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(login: string, password: string): Promise<CreateUserResult> {
    if (this.userRepositoryMap.findByLogin(login)) {
      throw new Error(`Bunday foydalanuvchi mavjud: ${login}`);
    }

    const user = await User.createUser(login, password);
    this.userRepositoryMap.save(user);
    return {
      userUuid: user.getUuid(),
      login: user.getLogin(),
    };
  }

  async signInUser(authHeader: string): Promise<string> {
    const base64Credentials = authHeader.replace('Basic ', '');
    const decode = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [login, password] = decode.split(':');
    console.log(password);
    const user: User | null = this.userRepositoryMap.findByLogin(login);

    if (!user) {
      throw new Error(`Bunday user mavjud emas: ${login}`);
    }

    const isMatch: boolean = await user.verifyPassword(password);

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return this.jwtService.signAsync({
      uuid: user.getUuid(),
      login: user.getLogin(),
    });
  }
}
