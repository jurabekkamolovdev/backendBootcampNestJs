import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../model/user.entity';
import { type IUserRepository } from './user.repository.interface';
import { UserDataMapper } from '../mapper/user-data.mapper';
import { User } from 'src/modules/domain/user/model/user.model';
import { IUserEntity } from '../model/interface/user.entity.interface';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly users: typeof UserEntity,
    private readonly mapper: UserDataMapper,
  ) {}

  async save(domainUser: User): Promise<boolean> {
    const entity: IUserEntity = this.mapper.toEntity(domainUser);
    await this.users.upsert({
      id: entity.id,
      login: entity.login,
      passwordHash: entity.passwordHash,
    });
    return true;
  }

  async findByLogin(userLogin: string): Promise<User | null> {
    const entity = await this.users.findOne({
      where: {
        login: userLogin,
      },
    });

    if (!entity) {
      throw new Error(`Bunday foydlanuvchi yoq: ${userLogin}`);
    }
    return this.mapper.toDomain(entity);
  }
}
