import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class UserEntity extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING })
  declare login: string;

  @Column({ type: DataType.STRING })
  declare passwordHash: string;

  @Column({ type: DataType.INTEGER })
  declare wins: number;

  @Column({ type: DataType.INTEGER })
  declare draws: number;

  @Column({ type: DataType.INTEGER })
  declare losses: number;
}
