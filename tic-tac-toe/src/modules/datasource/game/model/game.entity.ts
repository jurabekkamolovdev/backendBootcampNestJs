import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { PlayerRole } from '../../../domain/game/model/game.model';

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
  declare playerIdO: string;

  @Column({
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare currentPlayer: {
    id: string | null;
    role: PlayerRole;
  };

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
