import axios from "axios";
import { Category } from "../../categories";
import { Game, GameQueue } from "../../entities/game";
import { GameType } from "../../entities/type";
import { Platform } from "../../platforms";
import { Language, Store } from "../../store";

const clientId = "2a3b13e8-a80b-4795-853a-4cd52645919b";
const name = "Ubisoft Store";

export class UbisoftStore extends Store<string> {
  lang: Language;

  constructor(lang: Language) {
    super(name);
    this.lang = lang;
  }

  async allGames() {
    return this.searchGames("all-games"); // not always working
  }

  async uplayPlusGames() {
    return this.searchGames("all-games-ca-PREMIUM");
  }

  async searchGames(cgid: string): Promise<GameQueue> {
    const count = 200;

    var start = 0;
    var total: number;
    const ids: string[] = [];

    do {
      const res = await axios.get(
        `https://store.ubi.com/s/${this.lang.cc}_ubisoft/dw/shop/v19_8/product_search`,
        {
          params: {
            refine: `cgid=${cgid}`,
            count,
            client_id: clientId,
          },
        }
      );

      if (res.data.hits !== undefined) {
        ids.push(...res.data.hits.map((e: any) => e.product_id));
      }

      start += count;
      total = res.data.total;
    } while (start < total);

    return ids.map((e) => () => this.getGame(e));
  }

  async pullGame(id: string): Promise<Game> {
    const res = await axios.get(
      `https://store.ubi.com/s/${this.lang.cc}_ubisoft/dw/shop/v19_8/products/(${id})`,
      {
        params: {
          expand: "images,variations",
          client_id: clientId,
        },
      }
    );

    const data: UbiProduct = res.data.data[0];
    // console.log(data);

    const dev = data.c_productDeveloperString;
    const pub = data.c_productPublisherString;

    var cover: string | undefined;
    var hero: string | undefined;
    const screenshots: string[] = [];

    data.image_groups.forEach((g) => {
      switch (g.view_type) {
        case "large":
          cover = g.images[0].link;
          g.images.forEach((i) => screenshots.push(i.link));
          break;
        case "pdpbanner":
          hero = g.images[0].link;
          break;
      }
    });

    if (cover === undefined) {
      throw `[${name}] No cover provided`;
    }

    var trailer: string | undefined;
    if (
      data.c_productYoutubeIds !== undefined &&
      data.c_productYoutubeIds.length === 0
    ) {
      trailer =
        "https://www.youtube.com/watch?v=" + data.c_productYoutubeIds[0];
    }

    var platform = 0;
    data.variation_attributes
      ?.find((v) => v.id === "Platform")
      ?.values.forEach((val) => {
        const p = mapPlatform(val.value);
        if (p !== undefined) {
          platform |= p;
        }
      });

    const categories = [];
    if (data.c_productSingleBool === true) {
      categories.push(Category.SINGLE_PLAYER);
    }
    if (data.c_productMultiBool === true) {
      categories.push(Category.MULTI_PLAYER);
    }
    if (data.c_productCoopBool === true) {
      categories.push(Category.CO_OP);
    }

    if (
      data.c_supportedSubtitles !== undefined &&
      data.c_supportedSubtitles.includes(this.lang.lc)
    ) {
      categories.push(Category.CAPTIONS);
    }

    return Game.create({
      name: data.name,
      shortDescription: data.c_productDescriptionFirstParagraphString,
      developers: dev === undefined ? [] : [dev],
      publishers: pub === undefined ? [] : [pub],

      releaseDate: new Date(data.c_productReleaseDateTime),
      type: data.c_productGameDLC === "Game" ? GameType.GAME : GameType.DLC,
      categories: [], // tmp

      cover,
      background: hero,
      screenshots,
      trailer,

      prices: [],
    });
  }
}

function mapPlatform(id: string) {
  switch (id) {
    case "pcdl":
      return Platform.WINDOWS;
    case "ps4":
      return Platform.PS4;
    case "ps5":
      return Platform.PS5;
    case "xbox1":
      return Platform.XBOX_ONE;
    case "switch":
      return Platform.SWITCH;
  }

  console.log(`[${name}] Unknown platform: '${id}'`);
  return 0;
}
