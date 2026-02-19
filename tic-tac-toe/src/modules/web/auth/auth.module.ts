import { Module } from '@nestjs/common';
import { UserModule } from '../../domain/user/user.module';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
