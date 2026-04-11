export interface IUserEntity {
  id: string;
  login: string;
  passwordHash: string;

  wins: number;
  draws: number;
  losses: number;
}
