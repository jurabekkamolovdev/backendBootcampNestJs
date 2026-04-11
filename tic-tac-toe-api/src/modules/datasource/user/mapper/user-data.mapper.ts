import { Injectable } from '@nestjs/common';
import { IUserEntity } from '../model/interface/user.entity.interface';
import { User } from 'src/modules/domain/user/model/user.model';

@Injectable()
export class UserDataMapper {
  toEntity(domainUser: User): IUserEntity {
    return {
      id: domainUser.getUuid(),
      login: domainUser.getLogin(),
      passwordHash: domainUser.getPasswordHash(),
      wins: domainUser.getWins(),
      draws: domainUser.getDraws(),
      losses: domainUser.getLosses(),
    };
  }

  toDomain(entity: IUserEntity): User {
    return new User(
      entity.id,
      entity.login,
      entity.passwordHash,
      entity.wins,
      entity.draws,
      entity.losses,
    );
  }
}
