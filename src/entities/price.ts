import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./game";

export enum Currency {
  EUR = "EUR",
}

export enum Stores {
  STEAM,
  UBISOFT,
  EPIC_GAMES,
  MICROSOFT,
  STADIA,
}

@Entity()
export class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    enum: Stores,
  })
  store!: Stores;

  @Column({
    type: "int",
  })
  platform!: number;

  @Column()
  url!: string;

  @Column({
    enum: Currency,
    nullable: true,
  })
  currency?: Currency;

  @Column()
  initial!: number;

  @Column()
  current?: number;

  @ManyToOne(() => Game, (game) => game.prices)
  game!: Game;
}
