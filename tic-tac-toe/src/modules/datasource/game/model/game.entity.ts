import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'games',
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare playerIdX: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare playerId0: string;

  @Column({
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare currentPlayerId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare winnerUserId: string;

  @Column({
    type: DataType.STRING,
  })
  declare mode: 'USER' | 'COMPUTER';
}
