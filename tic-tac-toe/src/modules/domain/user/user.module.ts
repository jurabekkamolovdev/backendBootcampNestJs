import { Module } from '@nestjs/common';
import { UserServiceImpl } from './service/user.service.imp';
import { UserRepositoryModule } from '../../datasource/user/user.repository.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserRepositoryModule,
    PassportModule,
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
    JwtStrategy,
  ],
  exports: ['IUserService', JwtStrategy],
})
export class UserModule {}
