import { Injectable } from '@nestjs/common';
import { JwtResponseDto } from '../model/resoponse/user-signin.response';

@Injectable()
export class UserWebMapper {
  toJwtResopnse(access_token: string, refresh_token: string): JwtResponseDto {
    return {
      type: 'Bearer',
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
