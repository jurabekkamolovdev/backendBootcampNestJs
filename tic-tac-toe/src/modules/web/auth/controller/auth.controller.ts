import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import type { IUserService } from '../../../domain/user/service/user.service.interface';
import { SignUpRequest } from '../model/request/sign.up.request';
import { JwtAuthGuard } from '../../../domain/user/guard/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: { userId: string; login: string } }) {
    return req.user;
  }
}
