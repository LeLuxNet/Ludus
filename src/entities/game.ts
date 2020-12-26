import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../categories";
import { Price } from "./price";
import { GameType } from "./type";
import { ObjectType, Field, Int } from "type-graphql";

export type GameQueue = (() => Promise<Game>)[];

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  shortDescription!: string;

  @Field()
  @Column({
    nullable: true,
  })
  longDescription?: string;

  @Field(() => [String])
  @Column({
    type: "text",
    array: true,
  })
  developers!: string[];

  @Field(() => [String])
  @Column({
    type: "text",
    array: true,
  })
  publishers!: string[];

  @Field()
  @Column({
    nullable: true,
  })
  website?: string;

  @Field()
  @Column({
    nullable: true,
  })
  legal?: string;

  @Field()
  @Column({
    nullable: true,
  })
  releaseDate?: Date;

  @Field()
  @Column({
    nullable: true,
  })
  lastUpdate?: Date;

  @Field(() => Int)
  @Column({
    enum: GameType,
  })
  type!: GameType;

  @Field(() => [Int])
  @Column({
    type: "int",
    array: true,
  })
  categories!: Category[];

  @Field()
  @Column({
    nullable: true,
  })
  icon?: string;

  @Field()
  @Column({
    nullable: true,
  })
  logo?: string;

  @Field()
  @Column()
  cover!: string;

  @Field()
  @Column({
    nullable: true,
  })
  background?: string;

  @Field(() => [String])
  @Column({
    type: "text",
    array: true,
  })
  screenshots!: string[];

  @Field()
  @Column({
    nullable: true,
  })
  trailerThumbnail?: string;

  @Field()
  @Column({
    nullable: true,
  })
  trailer?: string;

  @OneToMany(() => Price, (price) => price.game, {
    cascade: true,
  })
  prices!: Price[];
}
