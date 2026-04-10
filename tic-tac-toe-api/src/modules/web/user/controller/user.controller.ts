import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import {
  type IUserService,
  USER_SERVICE,
} from 'src/modules/domain/user/service/user.service.interface';
import { JwtRequestDto } from '../model/request/user-sigup.request';
import {
  JwtAuthGuard,
  JwtRefreshGuard,
} from 'src/modules/infrastructure/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/modules/infrastructure/jwt/jwt.strategy';
import { User } from 'src/modules/domain/user/model/user.model';
import { UserWebMapper } from '../mapper/user-web.mapper';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    private readonly userWebMapper: UserWebMapper,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: JwtRequestDto) {
    await this.userService.signUpUser(dto.login, dto.password);

    return true;
  }

  @Post('signin')
  async signIn(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new Error('Basic auth header required');
    }

    const response: { access_token: string; refresh_token: string } =
      await this.userService.signInUser(authHeader);
    return this.userWebMapper.toJwtResopnse(
      response.access_token,
      response.refresh_token,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userUuid')
  async getUserByUuid(
    @Request() req: { user: JwtPayload },
    @Param('userUuid') userUuid: string,
  ) {
    console.log(req.user);
    const user: User | null = await this.userService.getUserByUuid(userUuid);
    if (!user) {
      return false;
    }
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Request() req: { user: JwtPayload }) {
    const resoponse = await this.userService.refreshTokens(req.user);

    return this.userWebMapper.toJwtResopnse(
      resoponse.access_token,
      resoponse.refresh_token,
    );
  }
}
