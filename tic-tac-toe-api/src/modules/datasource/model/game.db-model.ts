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
  uuid!: string;

  @Column({ type: DataType.JSONB })
  board!: GameBoardEntity;

  @Column({ type: DataType.UUID })
  playerXUuid!: string;

  @Column({ type: DataType.UUID, allowNull: true })
  playerOUuid?: string;

  @Column({ type: DataType.BOOLEAN })
  vsComputer!: boolean;

  @Column({ type: DataType.STRING })
  stateKind!: 'waiting_for_players' | 'turn' | 'draw' | 'win';

  @Column({ type: DataType.UUID, allowNull: true })
  stateUserUuid?: string;
}
