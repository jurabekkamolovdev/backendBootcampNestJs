import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type { GameBoardEntity } from './game-board.entity';

export interface GameDbModelCreationAttributes {
  uuid: string;
  board: GameBoardEntity;
  playerXUuid: string;
  playerOUuid?: string;
  vsComputer: boolean;
  stateKind: 'waiting_for_players' | 'turn' | 'draw' | 'win';
  stateUserUuid?: string;
}

@Table({
  tableName: 'games',
  timestamps: false,
})
export class GameDbModel extends Model<
  GameDbModel,
  GameDbModelCreationAttributes
> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare uuid: string;

  @Column({ type: DataType.JSONB })
  declare board: GameBoardEntity;

  @Column({ type: DataType.UUID })
  declare playerXUuid: string;

  @Column({ type: DataType.UUID, allowNull: true })
  declare playerOUuid?: string;

  @Column({ type: DataType.BOOLEAN })
  vsComputer!: boolean;

  @Column({ type: DataType.STRING })
  declare stateKind: 'waiting_for_players' | 'turn' | 'draw' | 'win';

  @Column({ type: DataType.UUID, allowNull: true })
  declare stateUserUuid?: string;
}
