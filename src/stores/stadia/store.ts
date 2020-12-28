import axios from "axios";
import { Platform } from "../../platforms";
import { Store } from "../../store";
import { Game, GameQueue } from "../../entities/game";
import { Price, Stores } from "../../entities/price";
import { GameType } from "../../entities/type";

const name = "Google Stadia";

// https://ssl.gstatic.com/stadia/gamers/landing_page/config/landing_page_us.json

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";

const substringFrom =
  "AF_initDataCallback({key: 'ds:3', isError:  false , hash: '";
const substringFrom2 = "x', data:";
const substringTo = "\n, sideChannel: {}}";

interface StadiaId {
  id: string;
  sku: string;
}

export class Stadia extends Store<StadiaId> {
  cookie: string;

  constructor(sid: string, hsid: string, ssid: string) {
    super(name);
    this.cookie = `SID=${sid}; HSID=${hsid}; SSID=${ssid}`;
  }

  async allGames(list: number = 3): Promise<GameQueue> {
    const data = await this.load(
      `https://stadia.google.com/store/list/${list}`
    );

    return data[2].map((e: any) => () =>
      this.getGame(
        {
          id: e[1],
          sku: e[0],
        },
        { data: e }
      )
    );
  }

  async pullGame(id: StadiaId, data?: any) {
    if (data === undefined) {
      data = await this.load(
        `https://stadia.google.com/store/details/${id.id}/sku/${id.sku}`
      );
    }

    // console.log(data);

    const trailerCard = data[9][2][13].find((e: any) => e.length === 3);
    var trailer: string | undefined;
    if (trailerCard !== undefined) {
      trailer = `https://www.youtube.com/watch?v=${trailerCard[2][1]}`;
    }

    const screenshots: string[] = data[9][2][13]
      .filter((e: any) => e.length === 2)
      .map((e: any) => toImg(e[1]));

    const url = `https://stadia.google.com/store/details/${data[1]}/sku/${data[0]}`;

    var prices: Price[] = [];
    if (data[15].length >= 1) {
      prices.push(toPrice(url, data[15][0][0]));
    }

    if (data[15].length !== 0 && data[15][0].length >= 3) {
      prices.push(toPrice(url, data[15][0][2]));
    }

    return Game.create({
      name: data[2],
      shortDescription: data[9][9],
      developers: data[16][1][0][2],
      publishers: data[16][0][2],

      website: data[9][32][4],
      legal: data[9][17],

      type: GameType.GAME,
      categories: [],

      icon: toImg(data[9][2][29]),
      logo: toImg(data[9][2][46]),
      cover: toImg(data[9][2][16]),
      background: toImg(data[9][2][9]),
      screenshots,
      trailer,

      prices,
    });
  }

  async load(url: string) {
    const res = await axios.get(url, {
      headers: {
        "user-agent": userAgent,
        cookie: this.cookie,
      },
    });

    const raw = res.data.substring(
      res.data.lastIndexOf(substringFrom) +
        substringFrom.length +
        substringFrom2.length,
      res.data.lastIndexOf(substringTo)
    );

    return JSON.parse(raw);
  }
}

function toImg(img: any): string {
  return img[4][0][1][1];
}

function toPrice(url: string, offer: any): Price {
  if (offer === null) {
    return Price.create({
      store: Stores.STADIA,
      platform: Platform.STADIA,
      url,
      initial: 0,
      current: 0,
    });
  }

  const values = offer[6][0];

  const initial = values[0] / 10000;

  return Price.create({
    store: Stores.STADIA,
    platform: Platform.STADIA,
    url,
    currency: offer[4],
    initial,
    current: values.length === 2 ? initial : values[2][0] / 10000,
  });
}
