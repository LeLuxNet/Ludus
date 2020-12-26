import { Game } from "./entities/game";

export interface Language {
  cc: string;
  lc: string;
}

export abstract class Store<T> {
  name: string;
  cache: Map<T, Game>;

  constructor(name: string) {
    this.name = name;
    this.cache = new Map();
  }

  async getGame(
    id: T,
    { useCache = true, data }: { useCache?: boolean; data?: any } = {}
  ) {
    if (!useCache) {
      const game = await this.pullGame(id, data);
      this.cache.set(id, game);
      return game;
    }

    const val = this.cache.get(id);
    if (val === undefined) {
      const game = await this.pullGame(id, data);
      this.cache.set(id, game);
      return game;
    } else {
      return val;
    }
  }

  abstract pullGame(id: T, data: any): Promise<Game>;
}
