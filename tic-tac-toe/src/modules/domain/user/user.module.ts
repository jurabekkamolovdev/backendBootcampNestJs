import { Module } from '@nestjs/common';
import { UserServiceImpl } from './service/user.service.imp';
import { UserRepositoryModule } from '../../datasource/user/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserServiceImpl,
    },
  ],
  exports: ['IUserService'],
})
export class UserModule {}
