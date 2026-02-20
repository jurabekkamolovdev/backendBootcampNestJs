import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '../model/user.entity';
import { UserDataMapper } from '../mapper/user-data.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly userDataMapper: UserDataMapper,
  ) {}

  async save(user: User) {
    const userEntity = this.userDataMapper.toEntity(user);
    await this.userModel.create(userEntity.get());
    return user;
  }
}
