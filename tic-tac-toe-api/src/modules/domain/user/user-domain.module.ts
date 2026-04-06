import { Module } from '@nestjs/common';
import { UserDatasourceModule } from 'src/modules/datasource/user/user-datasource.modeule';
import { USER_SERVICE } from './service/user.service.interface';
import { UserServiceImpl } from './service/user.service.impl';

@Module({
  imports: [UserDatasourceModule],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserServiceImpl,
    },
  ],
  exports: [USER_SERVICE],
})
export class UserDomainModule {}
