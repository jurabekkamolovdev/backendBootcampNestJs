import { Injectable } from '@nestjs/common';
import { type IUserRepositoryMap } from './user-map.repository.interface';
import { IUserEntity } from '../../model/interface/user.entity.interface';
import { UserDataMapper } from '../../mapper/user-data.mapper';
import { User } from 'src/modules/domain/user/model/user.model';

@Injectable()
export class UserRepositoryMapImpl implements IUserRepositoryMap {
  private readonly _db = new Map<string, IUserEntity>();

  constructor(private readonly userDataMapper: UserDataMapper) {}

  save(domainUser: User): boolean {
    const entity: IUserEntity = this.userDataMapper.toEntity(domainUser);
    if (!entity.id) {
      throw new Error(`UserEntity UUID mavjud emas`);
    }

    if (this._db.has(entity.id)) {
      throw new Error(`User allaqachon mavjud: ${entity.id}`);
    }

    this._db.set(entity.id, entity);
    console.log(entity);
    console.log(this._db);
    return true;
  }

  update(domainUser: User): boolean {
    const entity: IUserEntity = this.userDataMapper.toEntity(domainUser);

    if (!this._db.has(entity.id)) {
      throw new Error(`User topilmadi: ${entity.id}`);
    }

    this._db.set(entity.id, entity);
    return true;
  }

  findById(userUuid: string): User | null {
    const entity: IUserEntity | undefined = this._db.get(userUuid);

    if (!entity) {
      return null;
    }

    return this.userDataMapper.toDomain(entity);
  }
}
