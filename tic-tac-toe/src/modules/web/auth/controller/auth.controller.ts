import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import type { IUserService } from '../../../domain/user/service/user.service.interface';
import { SignUpRequest } from '../model/request/sign.up.request';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IUserService')
    private userService: IUserService,
  ) {}

  @Post('signup')
  async signUp(@Body() request: SignUpRequest) {
    return this.userService.create(request);
  }

  @Post('login')
  async login(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Basic auth header required');
    }
    return this.userService.login(authHeader);
  }
}
