import PromisePool from "@supercharge/promise-pool/dist";
import { EpicGames } from "./stores/epicgames/store";
import { MicrosoftStore } from "./stores/microsoft/store";
import { Stadia } from "./stores/stadia/store";
import { Discord } from "./stores/discord/store";
import { GOG } from "./stores/gog/store";
import { Steam } from "./stores/steam/store";
import { Language } from "./store";
import { UbisoftStore } from "./stores/ubisoft/store";
import { Game, GameQueue } from "./entities/game";
import AsyncLock from "async-lock";

const STEAM_KEY = process.env.STEAM_KEY;
if (STEAM_KEY === undefined) {
  console.error(
    "No 'STEAM_KEY' env variable. Get a Steam api key from https://steamcommunity.com/dev/apikey."
  );
  process.exit(1);
}

const { SID, HSID, SSID } = process.env;
if ((SID && HSID && SSID) === undefined) {
  console.error(
    "The env variables 'SID', 'HSID' and 'SSID' have to be set to the values of the corresponding Google cookies."
  );
  process.exit(1);
}

const { DISCORD_TOKEN } = process.env;
if (DISCORD_TOKEN === undefined) {
  console.error(
    "No 'DISCORD_TOKEN' env variable. This has to be a Discord user token. A bot token does not work here."
  );
}

const MAX_CONCURRENT = 500;

export async function loadGames(lang: Language) {
  const steam = new Steam(STEAM_KEY!, lang);
  const gog = new GOG(lang);
  const microsoft = new MicrosoftStore(lang);
  const ubisoft = new UbisoftStore(lang);
  const epicGames = new EpicGames(lang);
  const discord = new Discord(DISCORD_TOKEN!);
  const stadia = new Stadia(SID!, HSID!, SSID!);

  const queue: GameQueue = [];

  // queue.push(...(await steam.allGames()));

  // queue.push(...(await gog.allGames()));

  // queue.push(...(await microsoft.gamePassGames()));

  // queue.push(...(await ubisoft.uplayPlusGames()));

  // queue.push(...(await epicGames.allGames()));

  queue.push(...(await discord.allGames()));

  // queue.push(...(await stadia.allGames()));

  shuffle(queue);

  console.log(queue.length);

  const lock = new AsyncLock();

  const { results, errors } = await PromisePool.withConcurrency(MAX_CONCURRENT)
    .for(queue)
    .process(async (call) => {
      const game = await call();
      if (game === null) return;

      await lock.acquire(game.name, async () => {
        const target = await Game.findOne({
          where: {
            name: game.name,
          },
        });

        if (target === undefined) {
          await game.save();
        } else {
          target.longDescription ||= game.longDescription;
          target.website ||= game.trailer;
          target.legal ||= game.legal;
          target.releaseDate ||= game.releaseDate;
          target.lastUpdate || game.lastUpdate;
          target.icon ||= game.icon;
          target.logo ||= game.logo;
          target.background || game.background;
          target.trailerThumbnail || game.trailerThumbnail;
          target.trailer ||= game.trailer;

          // TODO: Filter duplicates
          target.developers.push(...game.developers);
          target.publishers.push(...game.publishers);
          target.categories.push(...game.categories);
          target.screenshots.push(...game.screenshots);

          for (const price of game.prices) {
            price.game = target;
            await price.save();
          }

          await target.save();
        }
      });
    });

  if (errors.length > 0) {
    console.error(`${errors.length} errors occured`);
    for (const err of errors) {
      console.error(err.message);
    }
  }
}

// Shuffles array in place
function shuffle<T>(arr: T[]) {
  var m = arr.length;
  var t;
  var i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
