import { Arg, Query, Resolver } from "type-graphql";
import { Game } from "../entities/game";

@Resolver()
export class SearchResolver {
  @Query(() => [Game])
  search(@Arg("query") query: string) {
    return Game.find({ where: { name: query } });
  }
}
