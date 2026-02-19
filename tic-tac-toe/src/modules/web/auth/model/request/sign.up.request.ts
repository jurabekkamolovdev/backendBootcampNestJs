import { Length, IsStrongPassword } from 'class-validator';

export class SignUpRequest {
  @Length(5, 10, { message: 'login must be at least 8 characters' })
  login: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 2,
      minSymbols: 1,
    },
    {
      message:
        'Password is too weak! It must be at least 6 characters ' +
        'long and include at least 1 uppercase letter, 1 lowercase letter, 2 numbers, and 1 symbol.',
    },
  )
  password: string;
}
