import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

export interface UserDbModelCreationAttributes {
  uuid: string;
  login: string;
  passwordHash: string;
}

@Table({
  tableName: 'users',
  timestamps: false,
})
export class UserDbModel extends Model<
  UserDbModel,
  UserDbModelCreationAttributes
> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare uuid: string;

  @Unique
  @Column({ type: DataType.STRING })
  declare login: string;

  @Column({ type: DataType.STRING })
  declare passwordHash: string;
}
