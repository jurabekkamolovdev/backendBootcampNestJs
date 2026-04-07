import { Module } from '@nestjs/common';
import { UserDataMapper } from './mapper/user-data.mapper';
import { USER_REPOSITORY_MAP } from './repository/Map/user-map.repository.interface';
import { USER_REPOSITORY } from './repository/user.repository.interface';
import { UserRepositoryMapImpl } from './repository/Map/user-map.repository.impl';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './model/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserEntity])],
  providers: [
    UserDataMapper,
    {
      provide: USER_REPOSITORY_MAP,
      useClass: UserRepositoryMapImpl,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [USER_REPOSITORY_MAP, USER_REPOSITORY],
})
export class UserDatasourceModule {}
