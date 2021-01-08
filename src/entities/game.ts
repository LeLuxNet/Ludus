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
import { ObjectType, Field, Int, ID } from "type-graphql";
import { Trailer } from "./trailer";

export type GameQueue = (() => Promise<Game | null>)[];

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  shortDescription!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  legal?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo?: string;

  @Field()
  @Column()
  cover!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  background?: string;

  @Field(() => [String])
  @Column({
    type: "text",
    array: true,
  })
  screenshots!: string[];

  @Column({ nullable: true })
  trailerThumbnail?: string;

  @Column({ nullable: true })
  trailer?: string;

  @Field(() => Trailer, { name: "trailer", nullable: true })
  apiTrailer() {
    if (this.trailerThumbnail === undefined || this.trailer === undefined) {
      return null;
    }
    return new Trailer(this.trailerThumbnail, this.trailer);
  }

  // @Field(() => [Price])
  @OneToMany(() => Price, (price) => price.game, {
    cascade: true,
  })
  prices!: Price[];
}
