import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  USERS_SERVICE,
  type UsersService,
} from '../domain/users.service.interface';
import type { UserDto } from './user.dto';

@Controller()
export class UsersController {
  constructor(@Inject(USERS_SERVICE) private readonly users: UsersService) {}

  @Get('/users/:uuid')
  async getUser(@Param('uuid') uuid: string): Promise<UserDto> {
    const user = await this.users.findByUuid(uuid);
    if (!user) throw new NotFoundException('User not found');
    return { uuid: user.uuid, login: user.login };
  }
}
