import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  USERS_SERVICE,
  type UsersService,
} from '../users/domain/users.service.interface';

export interface BasicCredentials {
  login: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(login: string, password: string): Promise<boolean> {
    return this.users.createUser(login, password);
  }

  async loginFromBasicHeader(
    authorizationHeader: string | undefined,
  ): Promise<string> {
    const creds = parseBasicAuthHeader(authorizationHeader);
    const user = await this.users.validateLoginPassword(
      creds.login,
      creds.password,
    );
    if (!user) throw new UnauthorizedException();
    return user.uuid;
  }

  issueAccessToken(userUuid: string): string {
    return this.jwt.sign({ sub: userUuid });
  }
}

function parseBasicAuthHeader(value: string | undefined): BasicCredentials {
  if (!value) throw new UnauthorizedException();
  const [scheme, encoded] = value.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !encoded) {
    throw new UnauthorizedException();
  }

  let decoded: string;
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    throw new UnauthorizedException();
  }

  const idx = decoded.indexOf(':');
  if (idx <= 0) throw new UnauthorizedException();
  return {
    login: decoded.slice(0, idx),
    password: decoded.slice(idx + 1),
  };
}
