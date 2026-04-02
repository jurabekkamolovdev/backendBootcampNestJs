import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserDbModel } from './datasource/user.db-model';
import { USERS_REPOSITORY } from './datasource/users.repository.interface';
import { UsersRepositoryImpl } from './datasource/users.repository';
import { USERS_SERVICE } from './domain/users.service.interface';
import { UsersServiceImpl } from './domain/users.service.impl';
import { UsersController } from './web/users.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserDbModel])],
  providers: [
    UsersRepositoryImpl,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryImpl,
    },
    UsersServiceImpl,
    {
      provide: USERS_SERVICE,
      useClass: UsersServiceImpl,
    },
  ],
  controllers: [UsersController],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
