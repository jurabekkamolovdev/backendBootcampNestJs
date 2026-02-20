import { Module } from '@nestjs/common';
import { UserDataMapper } from './mapper/user-data.mapper';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './model/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [
    UserDataMapper,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserRepositoryModule {}
