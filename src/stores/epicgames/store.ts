import axios, { AxiosError } from "axios";
import tough from "tough-cookie";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { Language, Store } from "../../store";
import { stringify } from "querystring";
import { Platform } from "../../platforms";
import { EpicUser } from "./user";
import { Game, GameQueue } from "../../entities/game";
import { GameType } from "../../entities/type";
import { EpicCatalogOffer, EpicMediaRef, EpicOAuthToken, EpicTag } from "./api";
import { searchQuery, gameQuery, mediaQuery } from "./queries";
import { Price, Stores } from "../../entities/price";
import { categoryMap } from "./tags";

axiosCookieJarSupport(axios);

const name = "Epic Games Store";

const oAuthHost = "account-public-service-prod03.ol.epicgames.com";
const launcherHost = "launcher-public-service-prod06.ol.epicgames.com";
const catalogHost = "catalog-public-service-prod06.ol.epicgames.com";

interface RawAssetData {
  appName: string;
  labelName: string;
  buildVersion: string;
  catalogItemId: string;
  namespace: string;
  assetId: string;
}

export interface EpicId {
  id: string;
  namespace: string;
}

export class EpicGames extends Store<EpicId> {
  language: Language;
  exchange?: string;

  constructor(language: Language) {
    super(name);
    this.language = language;
  }

  async login(sid: string) {
    const store = new tough.MemoryCookieStore();
    const jar = new tough.CookieJar(store);

    const headers = {
      "X-Epic-Event-Action": "login",
      "X-Epic-Event-Category": "login",
      "X-Epic-Strategy-Flags": "",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) EpicGamesLauncher/11.0.1-14907503+++Portal+Release-Live UnrealEngine/4.23.0-14907503+++Portal+Release-Live Chrome/84.0.4147.38 Safari/537.36",
    };

    await axios.get("https://www.epicgames.com/id/api/set-sid", {
      params: {
        sid,
      },
      headers,
      jar,
      withCredentials: true,
    });

    await axios.get("https://www.epicgames.com/id/api/csrf", {
      headers,
      jar,
      withCredentials: true,
    });

    const xsrfCookie = await findCookie(
      store,
      "www.epicgames.com",
      "/id",
      "XSRF-TOKEN"
    );
    if (!xsrfCookie) {
      throw "Expected XSRF token";
    }

    const res = await axios.post(
      "https://www.epicgames.com/id/api/exchange/generate",
      {},
      {
        headers: {
          "X-XSRF-TOKEN": xsrfCookie.value,
          ...headers,
        },
        jar,
        withCredentials: true,
      }
    );

    this.exchange = res.data.code;
  }

  async startSession(refreshToken?: string): Promise<EpicUser> {
    const params: { [key: string]: string } = {
      token_type: "eg1",
    };

    if (refreshToken !== undefined) {
      params["grant_type"] = "refresh_token";
      params["refresh_token"] = refreshToken;
    } else if (this.exchange !== undefined) {
      params["grant_type"] = "exchange_code";
      params["exchange_code"] = this.exchange;
    } else {
      throw "exchange or refresh token has to be set";
    }

    const res = await axios.post(
      `https://${oAuthHost}/account/api/oauth/token`,
      stringify(params),
      {
        auth: {
          username: "34a02cf8f4414e29b15921876da36f9a",
          password: "daafbccc737745039dffe53d94fc76cf",
        },
      }
    );

    const data: EpicOAuthToken = res.data;
    // console.log(data);

    console.log(`[${name}] Logged in as '${data.displayName}'`);

    return {
      name: data.displayName,

      accessToken: data.access_token,
      refreshToken: data.refresh_token,

      accessTokenExpires: new Date(data.expires_at),
      refreshTokenExpires: new Date(data.refresh_expires_at),
    };
  }

  async makeTokenValid(user: EpicUser) {
    const now = new Date(Date.now() + 60 * 1000); // now + 1min
    if (now < user.accessTokenExpires) {
      return user;
    }

    if (now < user.refreshTokenExpires) {
      return await this.startSession(user.refreshToken);
    }

    return undefined;
  }

  async allGames(): Promise<GameQueue> {
    const count = 1000;

    const elements: EpicCatalogOffer[] = [];
    var start = 0;
    while (true) {
      const res = await axios.post("https://www.epicgames.com/graphql", {
        query: searchQuery,
        variables: {
          locale: this.language.lc,
          country: this.language.cc.toUpperCase(),
          allowCountries: this.language.cc.toUpperCase(),
          category: "games", // "games/edition/base|bundles/games|editors|software/edition/base"
          count,
        },
      });
      const catalog = res.data.data.Catalog.searchStore;
      elements.push(...catalog.elements);
      start += count;

      if (start > catalog.paging.total) {
        break;
      }
    }

    return elements.map((d) => () => Promise.resolve(this.mapGame(d)));
  }

  async pullGame(id: EpicId): Promise<Game> {
    const res = await axios.post("https://www.epicgames.com/graphql", {
      query: gameQuery,
      variables: {
        id: id.id,
        namespace: id.namespace,
        locale: this.language.lc,
        country: this.language.cc,
      },
    });

    return this.mapGame(res.data.data.Catalog.catalogOffer);
  }

  mapGame(data: EpicCatalogOffer): Game {
    // console.log(data);

    var icon: string | undefined;
    var logo: string | undefined;
    var cover: string | undefined;
    var background: string | undefined;
    const screenshots: string[] = [];

    const url =
      data.productSlug === null
        ? undefined
        : `https://www.epicgames.com/store/product/${data.productSlug}`;

    data.keyImages.forEach((i) => {
      switch (i.type) {
        case "Thumbnail":
          icon = i.url;
          break;
        case "DieselGameBoxLogo":
          logo = i.url;
          break;
        case "OfferImageTall":
        case "DieselStoreFrontTall":
        case "DieselGameBoxTall":
        case "CodeRedemption_340x440":
        case "TakeoverTall":
          cover = i.url;
          break;
        case "OfferImageWide":
        case "DieselStoreFrontWide":
        case "DieselGameBox":
        case "DieselGameBoxWide":
        case "TakeoverWide":
          background = i.url;
          break;
        case "Sale": // ?
        case "Screenshot":
          screenshots.push(i.url);
          break;
        case "TakeoverLogoSmall":
        case "TakeoverLogo":
        case "VaultClosed":
        case "ComingSoon": // ?
        case "ESRB":
          break; // Ignore
        default:
          console.log(
            `[${name}] Unknown image type: '${i.type}' at ${url} (${i.url})`
          );
      }
    });

    if (cover === undefined) {
      if (logo !== undefined) {
        // TODO: Add background and change aspect ratio
        cover = icon;
      } else {
        console.log(url);
        throw `[${name}] No cover provided`;
      }
    }

    const categories: string[] = data.categories.map((e) => e.path);
    const type = categories.includes("dlc") ? GameType.DLC : GameType.GAME;

    const tags = data.tags.map(mapTag).filter((e) => e !== null);

    const prices: Price[] = [];
    if (data.price !== null) {
      const pData = data.price.totalPrice;
      const price = Price.create({
        store: Stores.EPIC_GAMES,
        platform: Platform.WINDOWS, // tmp
        url,
        currency: pData.currencyCode,
        initial: pData.originalPrice,
        current: pData.discountPrice,
      });
      prices.push(price);
    }

    return Game.create({
      name: data.title,
      shortDescription: data.description,
      longDescription: data.longDescription || undefined,
      developers: data.developer === null ? [] : [data.developer],
      publishers: [data.seller.name],

      releaseDate: new Date(data.releaseDate),
      lastUpdate: new Date(data.lastModifiedDate),

      type,
      categories: [],

      icon,
      logo,
      cover,
      background,
      screenshots,
      prices,
    });
  }
}

async function getTrailer(mediaRefId: string) {
  const res = await axios.post("https://www.epicgames.com/graphql", {
    query: mediaQuery,
    variables: {
      mediaRefId,
    },
  });

  const data: EpicMediaRef = res.data.data.Media.getMediaRef;

  var trailer: string | undefined;
  var thumbnail: string | undefined;

  for (const o of data.outputs) {
    switch (o.key) {
      case "high":
        trailer = o.url;
        break;
      case "thumbnail":
        thumbnail = o.url;
        break;
    }
  }

  return {
    trailer,
    thumbnail,
  };
}

function authError(err: AxiosError): never {
  if (
    err.response !== undefined &&
    err.response.data.errorCode ===
      "errors.com.epicgames.common.authentication.token_verification_failed"
  ) {
    throw `[${name}] Authentication failed (Access Token invalid)`;
  }
  throw err;
}

function findCookie(
  store: tough.Store,
  domain: string,
  path: string,
  key: string
) {
  return new Promise<tough.Cookie | null>((resolve, reject) =>
    store.findCookie(domain, path, key, (err, cookie) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(cookie);
      }
    })
  );
}

function mapPlatform(platform: Platform) {
  switch (platform) {
    case Platform.WINDOWS:
      return "Windows";
    case Platform.MAC:
      return "Mac";
    case Platform.LINUX:
      return "";
  }

  console.log(`[Epic Games Store] Unknown platform: '${platform}'`);
  return 0;
}

function getHeader(accessToken: string) {
  return {
    Authorization: `bearer ${accessToken}`,
  };
}

const platformMap: { [key: string]: Platform } = {
  Win32: Platform.WINDOWS,
  Windows: Platform.WINDOWS,
  Mac: Platform.MAC,
};

function parsePlatforms(attribute: { value: string }) {
  if (attribute === undefined) {
    return 0;
  }

  var res = 0;
  attribute.value.split(",").forEach((e) => {
    res |= platformMap[e];
  });
  return res;
}

function mapTag(tag: EpicTag) {
  const category = categoryMap.get(tag.id);

  if (category === undefined) {
    console.warn(`[${name}] Unknown tag: ${tag.id} (${tag.name})`);
    return null;
  }

  return category;
}
