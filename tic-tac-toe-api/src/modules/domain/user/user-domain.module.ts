import { Module } from '@nestjs/common';
import { UserDatasourceModule } from 'src/modules/datasource/user/user-datasource.modeule';
import { USER_SERVICE } from './service/user.service.interface';
import { UserServiceImpl } from './service/user.service.impl';
import { AppJwtModule } from 'src/modules/infrastructure/jwt/jwt.module';

@Module({
  imports: [UserDatasourceModule, AppJwtModule],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserServiceImpl,
    },
  ],
  exports: [USER_SERVICE],
})
export class UserDomainModule {}
