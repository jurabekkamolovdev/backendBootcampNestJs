import { Module } from '@nestjs/common';
import { UserDataMapper } from './mapper/user-data.mapper';
import { USER_REPOSITORY_MAP } from './repository/Map/user-map.repository.interface';
import { UserRepositoryMapImpl } from './repository/Map/user-map.repository.impl';

@Module({
  providers: [
    UserDataMapper,
    {
      provide: USER_REPOSITORY_MAP,
      useClass: UserRepositoryMapImpl,
    },
  ],
  exports: [USER_REPOSITORY_MAP],
})
export class UserDatasourceModule {}
