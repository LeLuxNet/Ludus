import { Arg, Query, Resolver } from "type-graphql";
import { Like } from "typeorm";
import { Game } from "../entities/game";

@Resolver()
export class GameResolver {
  @Query(() => Game)
  game(@Arg("id") id: string) {
    return Game.findOne({ where: { id } });
  }

  @Query(() => [Game])
  search(@Arg("query") query: string) {
    return Game.find({ where: { name: Like(`%${query}%`) } });
  }
}
