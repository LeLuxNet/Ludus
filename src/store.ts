import { Game } from "./entities/game";

export interface Language {
  cc: string;
  lc: string;
}

export abstract class Store<T> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getGame(id: T, data?: any): Promise<Game | null>;
}
