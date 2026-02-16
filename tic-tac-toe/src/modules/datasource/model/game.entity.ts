import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'game',
  timestamps: false,
})
export class GameModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.STRING,
  })
  declare uuid: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  declare board: {
    cells: number[][];
    size: number;
  };
}
