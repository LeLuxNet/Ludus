import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { loadGames } from "./load";
import { SearchResolver } from "./resolvers/search";
import { buildSchema } from "type-graphql";

const lang = {
  lc: "de",
  cc: "de",
};

(async () => {
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
    resolvers: [SearchResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  apolloServer.applyMiddleware({ app });

  app.listen(80, () => console.log("Listening"));
})();
