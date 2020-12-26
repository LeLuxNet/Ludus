import axios, { AxiosError } from "axios";
import tough from "tough-cookie";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { Language, Store } from "../../store";
import { stringify } from "querystring";
import { Platform } from "../../platforms";
import { EpicUser } from "./user";
import { Game } from "../../entities/game";
import { GameType } from "../../entities/type";
import { Price, Stores } from "../../entities/price";

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
  catalogItemId: string;
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

  async platformGames(
    accessToken: string,
    platform: Platform,
    label: string = "Live"
  ): Promise<Promise<Game>[]> {
    const res = await axios
      .get(
        `https://${launcherHost}/launcher/api/public/assets/${mapPlatform(
          platform
        )}`,
        {
          params: {
            label,
          },
          headers: getHeader(accessToken),
        }
      )
      .catch(authError);

    return res.data.map((e: RawAssetData) =>
      this.getGame(e, { data: accessToken })
    );
  }

  async pullGame(
    { namespace, catalogItemId }: EpicId,
    accessToken: string
  ): Promise<Game> {
    const res = await axios
      .get(
        `https://${catalogHost}/catalog/api/shared/namespace/${namespace}/bulk/items`,
        {
          params: {
            id: catalogItemId,
            includeDLCDetails: true,
            includeMainGameDetails: true,
            country: this.language.cc,
            locale: this.language.lc,
          },
          headers: getHeader(accessToken),
        }
      )
      .catch(authError);

    const data: GameItem = res.data[catalogItemId];
    // console.log(data);

    var icon: string | undefined;
    var logo: string | undefined;
    var cover: string | undefined;
    var background: string | undefined;
    const screenshots: string[] = [];

    data.keyImages.forEach((i) => {
      switch (i.type) {
        case "Thumbnail":
          icon = i.url;
          break;
        case "DieselGameBoxLogo":
          logo = i.url;
          break;
        case "DieselGameBoxTall":
          cover = i.url;
          break;
        case "DieselGameBox":
          background = i.url;
          break;
        case "Sale": // ?
        case "Screenshot":
          screenshots.push(i.url);
          break;
        /* default:
          console.log(i.type); */
      }
    });

    if (cover === undefined) {
      throw `[${name}] No cover provided`;
    }

    const categories: string[] = data.categories.map((e: any) => e.path);
    const type = categories.includes("dlc") ? GameType.DLC : GameType.GAME;

    const platform = parsePlatforms(data.customAttributes.SupportedPlatforms);

    return Game.create({
      name: data.title,
      shortDescription: data.description,
      longDescription: data.longDescription,
      developers: [data.developer],
      publishers: [data.developer],

      releaseDate: new Date(data.releaseInfo[0].dateAdded),
      lastUpdate: new Date(data.lastModifiedDate),

      type,
      categories: [],

      icon,
      logo,
      cover,
      screenshots,

      prices: [],
    });
  }
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
