import { Module } from '@nestjs/common';
import { UserDomainModule } from 'src/modules/domain/user/user-domain.module';
import { UserController } from '../user/controller/user.controller';
import { AppJwtModule } from 'src/modules/infrastructure/jwt/jwt.module';
import { UserWebMapper } from './mapper/user-web.mapper';

@Module({
  imports: [UserDomainModule, AppJwtModule],
  providers: [UserWebMapper],
  controllers: [UserController],
})
export class UserControllerModule {}
