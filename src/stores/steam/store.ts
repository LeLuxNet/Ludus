import axios, { AxiosInstance } from "axios";
import axiosRateLimit from "axios-rate-limit";
import { Category } from "../../categories";
import { Game, GameQueue } from "../../entities/game";
import { Price, Stores } from "../../entities/price";
import { GameType } from "../../entities/type";
import { Platform } from "../../platforms";
import { Language, Store } from "../../store";
import { SteamAppListEntry, SteamFeatured, SteamAppDetails } from "./api";
import { categoryList } from "./categories";

const typeMap: { [key: string]: GameType } = {
  game: GameType.GAME,
  dlc: GameType.DLC,
  demo: GameType.DEMO,
  advertising: GameType.ADVERTISING,
  mod: GameType.MOD,
  video: GameType.VIDEO,
};

const name = "Steam";

export class Steam extends Store<number> {
  key: string;
  lang: Language;

  storeAxios: AxiosInstance;

  constructor(key: string, lang: Language) {
    super(name);
    this.key = key;
    this.lang = lang;

    this.storeAxios = axiosRateLimit(
      axios.create({
        baseURL: "https://store.steampowered.com/api",
      }),
      {
        maxRequests: 200,
        perMilliseconds: 5 * 60 * 1000,
      } // 200 requests per 5 minutes
    );
  }

  async allGames(): Promise<GameQueue> {
    const res = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v0002",
      {
        params: {
          key: this.key,
          format: "json",
        },
      }
    );

    const data: SteamAppListEntry[] = res.data.applist.apps;
    return data.map((e) => () => this.getGame(e.appid));
  }

  async featuredGames() {
    const res = await this.storeAxios.get("featured");
    const data: SteamFeatured = res.data;

    const featured = data.featured_win.concat(
      data.featured_mac,
      data.featured_linux
    );

    return featured.map((e) => this.getGame(e.id));
  }

  async gamesByUser(userId: string) {
    const res = await axios.get(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001",
      {
        params: {
          key: this.key,
          steamid: userId,
          format: "json",
          include_appinfo: 1,
        },
      }
    );

    const data: SteamAppListEntry[] = res.data.response.games;

    return data.map((e) => this.getGame(e.appid, { data: e.img_icon_url }));
  }

  async pullGame(appId: number, iconHash?: string) {
    const res = await this.storeAxios.get("appdetails", {
      params: {
        appids: appId,
        cc: this.lang.cc,
        lc: this.lang.lc,
      },
    });

    const data: SteamAppDetails = res.data[appId].data;

    var trailer: string | undefined;
    var trailerThumbnail: string | undefined;
    if (data.movies !== undefined) {
      const movie = data.movies[0];

      trailer = movie.mp4.max;
      trailerThumbnail = movie.thumbnail;
    }

    const categories = data.categories
      .map(mapCategory)
      .filter((x) => x !== null) as Category[];

    const platform =
      (data.platforms.windows ? Platform.WINDOWS : 0) |
      (data.platforms.mac ? Platform.LINUX : 0) |
      (data.platforms.linux ? Platform.MAC : 0);

    const url = `https://store.steampowered.com/app/${data.steam_appid}`;

    var price: Price;
    if (data.price_overview === undefined) {
      price = Price.create({
        store: Stores.STEAM,
        platform,
        url,
        initial: 0,
        current: 0,
      });
    } else {
      price = Price.create({
        store: Stores.STEAM,
        platform,
        url,
        currency: data.price_overview.currency,
        initial: data.price_overview.initial,
        current: data.price_overview.final,
      });
    }

    return Game.create({
      name: data.name,
      shortDescription: data.short_description,
      developers: data.developers,
      publishers: data.publishers,

      website: data.website,
      legal: data.legal_notice,

      releaseDate: data.release_date.coming_soon
        ? undefined
        : new Date(data.release_date.date),

      type: typeMap[data.type],
      categories,

      icon: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${data.steam_appid}/${iconHash}.jpg`,
      logo: `https://steamcdn-a.akamaihd.net/steam/apps/${data.steam_appid}/logo.png`,
      cover: `https://steamcdn-a.akamaihd.net/steam/apps/${data.steam_appid}/library_600x900_2x.jpg`,
      background: data.background,
      screenshots: data.screenshots.map((e) => e.path_full),
      trailerThumbnail,
      trailer,

      prices: [price],
    });
  }
}

function mapCategory({ id, description }: { id: number; description: string }) {
  const category = categoryList[id - 1]; // ids start at 1

  if (category === undefined) {
    console.warn(`[${name}] Unknown category: ${id} (${description})`);
    return null;
  }

  return category;
}
