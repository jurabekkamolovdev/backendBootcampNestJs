import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateGameRequestDto {
  @IsOptional()
  @IsIn(['computer', 'user'])
  opponent?: 'computer' | 'user';
}

export class MoveRequestDto {
  @IsInt()
  @Min(0)
  @Max(2)
  row!: number;

  @IsInt()
  @Min(0)
  @Max(2)
  col!: number;
}
