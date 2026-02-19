import { Module } from '@nestjs/common';
import { UserServiceImpl } from './service/user.service.imp';

@Module({
  providers: [
    {
      provide: 'IUserService',
      useClass: UserServiceImpl,
    },
  ],
  exports: ['IUserService'],
})
export class UserModule {}
