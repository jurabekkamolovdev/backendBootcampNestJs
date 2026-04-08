import { Module } from '@nestjs/common';
import { UserDomainModule } from 'src/modules/domain/user/user-domain.module';
import { UserController } from '../user/controller/user.controller';
import { AppJwtModule } from 'src/modules/infrastructure/jwt/jwt.module';

@Module({
  imports: [UserDomainModule, AppJwtModule],
  controllers: [UserController],
})
export class UserControllerModule {}
