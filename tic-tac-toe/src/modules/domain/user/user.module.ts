import { Module } from '@nestjs/common';
import { UserServiceImpl } from './service/user.service.imp';
import { UserRepositoryModule } from '../../datasource/user/user.repository.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserRepositoryModule,
    JwtModule.register({
      global: true,
      secret: 'jwt_token',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserServiceImpl,
    },
  ],
  exports: ['IUserService'],
})
export class UserModule {}
