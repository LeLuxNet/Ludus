import axiosRateLimit from "axios-rate-limit";
import { Game, GameQueue } from "../../entities/game";
import { Store } from "../../store";
import axios, { AxiosError, AxiosInstance, AxiosPromise } from "axios";
import {
  DiscordDiscovery,
  DiscordStoreChannel,
  DiscordStoreListing,
  DiscordAssetItem,
  DiscordDeveloper,
} from "./api";
import { GameType } from "../../entities/type";
import { Currency, Price, Stores } from "../../entities/price";
import { Platform } from "../../platforms";
import { categoryList } from "./categories";
import { Category } from "../../categories";

const name = "Discord";
const discoveryLimit = 48;

const baseUrl = "https://discord.com/api/v8";

export class Discord extends Store<string> {
  token: string;

  baseAxios: AxiosInstance;

  constructor(token: string) {
    super(name);
    this.token = token;

    this.baseAxios = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: this.token,
      },
    });
  }

  async allGames(): Promise<GameQueue> {
    const stores: [string, string][] = [];
    const promises = [];

    var offset = 0;
    while (true) {
      const res = await this.baseAxios
        .get("discoverable-guilds", {
          params: {
            offset,
            limit: discoveryLimit,
          },
        })
        .catch(rateLimitRetry);

      const data: DiscordDiscovery = res.data;

      for (const guild of data.guilds) {
        if (guild.features.includes("COMMERCE")) {
          promises.push(
            this.baseAxios.get(`guilds/${guild.id}/channels`).then((res) => {
              const data: DiscordStoreChannel[] = res.data;

              const storeChannels = data.filter((e) => e.type === 6);

              for (const store of storeChannels) {
                const everyone = store.permission_overwrites.find(
                  (e) => e.id === store.guild_id
                );

                if (
                  everyone !== undefined &&
                  !(parseInt(everyone.deny) & 0x400)
                ) {
                  stores.push([store.id, store.guild_id]);
                  /*console.log(
                    store.guild_id,
                    store.id,
                    store.name,
                    store.permission_overwrites
                  ); */
                }
              }
            })
          );
        }
      }

      offset += data.guilds.length;
      if (offset === data.total) {
        break;
      }
    }

    await Promise.all(promises);

    return stores.map((e) => () => this.getGame(e[0], { data: e[1] }));
  }

  async pullGame(channelId: string, guildId: string): Promise<Game> {
    const res = await this.baseAxios
      .get(`channels/${channelId}/store-listing`)
      .catch(rateLimitRetry);

    const data: DiscordStoreListing = res.data;

    const screenshots: string[] = [];
    if (data.carousel_items !== undefined) {
      const carousel = new Set(
        (data.carousel_items.filter(
          (e) => "asset_id" in e
        ) as DiscordAssetItem[]).map((e) => e.asset_id)
      );

      if (data.assets !== undefined) {
        for (const asset of data.assets) {
          if (carousel.has(asset.id) && asset.mime_type.startsWith("image/")) {
            screenshots.push(assetUrl(asset.id, data.sku.id));
          }
        }
      }
    }

    var platform = 0;
    if (data.sku.system_requirements !== undefined) {
      Object.keys(data.sku.system_requirements).forEach((e) => {
        switch (e) {
          case "1":
            platform |= Platform.WINDOWS;
            break;
          case "2":
            platform |= Platform.MAC;
            break;
          default:
            console.warn(`[${name}] Unknown platform: '${e}'`);
        }
      });
    }

    const prices: Price[] =
      data.sku.price === undefined
        ? []
        : [
            Price.create({
              store: Stores.DISCORD,
              platform,
              url: `https://discord.com/channels/${guildId}/${data.id}`,
              launchUrl: `discord:///library/${data.sku.id}/launch`,
              currency: <Currency>data.sku.price.currency.toUpperCase(),
              initial: data.sku.price.amount,
              current: data.sku.price.sale_amount || data.sku.price.amount,
            }),
          ];

    const categories = data.sku.features
      .map((e) => mapFeature(e, data.sku.name))
      .filter((x) => x !== null) as Category[];

    const coverAssets =
      data.box_art || data.thumbnail || data.header_logo_dark_theme;

    return Game.create({
      name: data.sku.name,
      shortDescription: data.summary,
      longDescription: data.description,

      developers: mapDevelopers(data.sku.application.developers),
      publishers: mapDevelopers(data.sku.application.publishers),

      legal: data.sku.legal_notice,
      type: [
        GameType.GAME,
        GameType.DLC,
        GameType.DLC, // In-app item
      ][data.sku.type - 1],

      categories,

      logo: assetUrl(data.header_logo_dark_theme?.id, data.sku.id),
      cover: assetUrl(
        (
          coverAssets ||
          data.assets?.find((e) => e.mime_type.startsWith("image/"))
        )?.id,
        data.sku.id
      ),
      background: assetUrl(data.header_background?.id, data.sku.id),

      screenshots,

      prices,
    });
  }
}

function mapFeature(id: number, n: string) {
  const category = categoryList[id - 1]; // ids start at 1

  if (category === undefined) {
    console.warn(`[${name}] Unknown category: ${id} at '${n}'`);
    return null;
  }

  return category;
}

function rateLimitRetry(err: AxiosError) {
  if (err.response?.status === 403) {
    console.log(err.config.url);
    throw "";
  }

  if (err.response === undefined || err.response.status !== 429) {
    throw err;
  }

  return new Promise<AxiosPromise>((resolve) => {
    setTimeout(
      () => resolve(axios(err.config)),
      err.response!.headers["retry-after"] * 1000
    );
  });
}

function assetUrl(assetId: string, skuId: string): string;
function assetUrl(
  assetId: string | undefined,
  skuId: string
): string | undefined;

function assetUrl(assetId: string | undefined, skuId: string) {
  if (assetId === undefined) {
    return undefined;
  }
  return `https://cdn.discordapp.com/app-assets/${skuId}/store/${assetId}?size=1024`;
}

function mapDevelopers(devs?: DiscordDeveloper[]) {
  if (devs === undefined) {
    return [];
  }
  return devs.map((e) => e.name);
}
