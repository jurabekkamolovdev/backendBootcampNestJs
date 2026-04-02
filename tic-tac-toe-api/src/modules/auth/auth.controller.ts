import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { SignUpRequestDto, type SignInResponseDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('/signup')
  async signUp(@Body() body: SignUpRequestDto): Promise<{ success: boolean }> {
    const success = await this.auth.register(body.login, body.password);
    return { success };
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<SignInResponseDto> {
    const userUuid = await this.auth.loginFromBasicHeader(authorization);
    return { accessToken: this.auth.issueAccessToken(userUuid) };
  }
}
