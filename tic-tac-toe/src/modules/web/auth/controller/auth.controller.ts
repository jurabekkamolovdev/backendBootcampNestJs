import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Headers,
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
    try {
      return await this.userService.create(request);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Post('login')
  async login(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new Error('Basic auth header required');
    }

    return await this.userService.login(authHeader);
  }
}
