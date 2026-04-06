import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  type IUserService,
  USER_SERVICE,
} from 'src/modules/domain/user/service/user.service.interface';
import { CreateUserRequestDto } from '../model/request/user-create.request';
import { CreateUserResult } from 'src/modules/domain/user/model/user-result';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserRequestDto) {
    const resultDomain: CreateUserResult = await this.userService.createUser(
      dto.login,
      dto.password,
    );

    return resultDomain;
  }
}
