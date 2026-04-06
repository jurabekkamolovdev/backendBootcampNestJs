import { Module } from '@nestjs/common';
import { UserDomainModule } from 'src/modules/domain/user/user-domain.module';
import { UserController } from '../user/controller/user.controller';

@Module({
  imports: [UserDomainModule],
  controllers: [UserController],
})
export class UserControllerModule {}
