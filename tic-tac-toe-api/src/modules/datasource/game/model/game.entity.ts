import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type {
  Opponent,
  GameState,
  Player,
} from 'src/modules/domain/game/model/game.model';

@Table({
  tableName: 'games',
  timestamps: false,
})
export class GameEntity extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare uuid: string;

  @Column({ type: DataType.JSON })
  declare board: {
    cells: number[][];
    size: number;
  };
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare created_at: Date;

  @Column({ type: DataType.STRING })
  declare opponent: Opponent;

  @Column({ type: DataType.JSON })
  declare state: GameState;

  @Column({ type: DataType.JSON, allowNull: true })
  declare playerX?: Player | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare playerO?: Player | null;
}
