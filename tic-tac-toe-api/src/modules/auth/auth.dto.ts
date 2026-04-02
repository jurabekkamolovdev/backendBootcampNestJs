import { IsString, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @MinLength(1)
  login!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

export interface SignInResponseDto {
  accessToken: string;
}
