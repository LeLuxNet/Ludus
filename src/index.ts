import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { loadGames } from "./load";
import { GameResolver } from "./resolvers/game";
import { buildSchema } from "type-graphql";

const lang = {
  lc: "dE",
  cc: "De",
};

(async () => {
  console.log("Starting");

  await createConnection({
    type: "postgres",

    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "ludus",

    synchronize: true,
    // logging: true,
    entities: ["dist/entities/*.js"],
  });

  await loadGames(lang);

  const app = express();

  const schema = await buildSchema({
    resolvers: [GameResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  apolloServer.applyMiddleware({ app });

  app.listen(80, () => console.log("Listening"));
})();
