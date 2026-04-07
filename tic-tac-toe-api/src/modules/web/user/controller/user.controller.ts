import { Body, Controller, Inject, Post, Headers } from '@nestjs/common';
import {
  type IUserService,
  USER_SERVICE,
} from 'src/modules/domain/user/service/user.service.interface';
import { CreateUserRequestDto } from '../model/request/user-create.request';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: CreateUserRequestDto) {
    await this.userService.createUser(dto.login, dto.password);

    return true;
  }

  @Post('signin')
  async signIn(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new Error('Basic auth header required');
    }

    const { access_token, uuid }: { access_token: string; uuid: string } =
      await this.userService.signInUser(authHeader);
    return {
      access_token: access_token,
      uuid: uuid,
    };
  }
}
