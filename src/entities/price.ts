import { Field, ObjectType } from "type-graphql";
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
  GOG,
  UBISOFT,
  EPIC_GAMES,
  MICROSOFT,
  STADIA,
}

@ObjectType()
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

  @Field()
  @Column()
  url!: string;

  @Field({ nullable: true })
  @Column({
    enum: Currency,
    nullable: true,
  })
  currency?: Currency;

  @Field()
  @Column()
  initial!: number;

  @Field({ nullable: true })
  @Column()
  current?: number;

  @ManyToOne(() => Game, (game) => game.prices)
  game!: Game;
}
