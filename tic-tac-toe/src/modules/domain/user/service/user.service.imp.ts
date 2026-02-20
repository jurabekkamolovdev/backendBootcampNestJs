import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.model';
import { JwtService } from '@nestjs/jwt';
import { IUserService, UserPayload } from './user.service.interface';
import type { IUserRepository } from '../../../datasource/user/repository/user.repository.interface';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}
  async create(data: UserPayload): Promise<User> {
    const user = await User.create(data);
    return await this.userRepository.save(user);
  }

  async login(authHeader: string): Promise<{ access_token: string }> {
    const base64Credentials = authHeader.replace('Basic ', '');
    const decode = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    console.log(base64Credentials);
    console.log(decode);
    const [login, password] = decode.split(':');

    console.log(login, password);

    const user = await this.userRepository.findByLogin(login);

    const isMatch = await user.verifyPassword(password);

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const payload = { sub: user.getId(), login: user.getLogin() };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
