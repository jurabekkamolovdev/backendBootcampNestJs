import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class UserModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.STRING,
  })
  declare uuid: string;

  @Column({
    type: DataType.STRING,
  })
  declare login: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;
}
