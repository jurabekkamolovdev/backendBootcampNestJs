import { Injectable } from '@nestjs/common';
import { GameEntity } from '../model/game.entity';

@Injectable()
export class GameStorage {
  private readonly games: Map<string, GameEntity> = new Map();

  set(id: string, game: GameEntity) {
    this.games.set(id, game);
  }

  get(id: string) {
    return this.games.get(id);
  }

  delete(id: string) {
    return this.games.delete(id);
  }

  has(id: string) {
    return this.games.has(id);
  }

  clear() {
    this.games.clear();
  }

  size() {
    return this.games.size;
  }
}
