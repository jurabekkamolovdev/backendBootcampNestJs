import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/model/user.model';
import { UserModel } from '../model/user.entity';

@Injectable()
export class UserDataMapper {
  toEntity(user: User) {
    return UserModel.build({
      uuid: user.getId(),
      login: user.getLogin(),
      password: user.getPassword(),
    });
  }
}
