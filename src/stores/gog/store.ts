import axios from "axios";
import { Store, Language } from "../../store";
import { Game, GameQueue } from "../../entities/game";
import { GameType } from "../../entities/type";
import { GOGPage, GOGProduct, GOGSearchProduct, GOGFeature } from "./api";
import { categoryMap } from "./features";
import { Category } from "../../categories";
import { youTubeTrailer } from "../../entities/trailer";

const name = "GOG";

export class GOG extends Store<number> {
  lang: Language;

  constructor(lang: Language) {
    super(name);
    this.lang = lang;
  }

  async allGames(): Promise<GameQueue> {
    const queue: GameQueue = [];
    var page = 1;
    while (true) {
      const res = await axios.get(
        `https://embed.gog.com/games/ajax/filtered?page=${page}`
      );

      const data: GOGPage = res.data;
      queue.push(
        ...data.products.map((e) => () => this.getGame(e.id, { data: e }))
      );

      if (page++ >= data.totalPages) {
        break;
      }
    }

    return queue;
  }

  async pullGame(id: number, sData: GOGSearchProduct) {
    const res = await axios.get(
      `https://api.gog.com/v2/games/${id}?locale=${this.lang.lc}-${this.lang.cc}`
    );

    const data: GOGProduct = res.data;

    const type = {
      GAME: GameType.GAME,
      DLC: GameType.DLC,
      PACK: GameType.DLC,
    }[data._embedded.productType];

    const screenshots = data._embedded.screenshots.map((e) =>
      e._links.self.href.replace("{formatter}", "1600")
    );

    var trailer = {};
    if (
      data._embedded.videos !== undefined &&
      data._embedded.videos.length > 0
    ) {
      trailer = youTubeTrailer(data._embedded.videos[0].videoId);
    }

    const categories = data._embedded.features
      .map(mapFeature)
      .filter((e) => e !== null) as Category[];

    return Game.create({
      name: sData.title,
      shortDescription: data.description,
      type,
      legal: data.copyrights,
      developers: data._embedded.developers.map((e) => e.name),
      publishers: [data._embedded.publisher.name],

      categories,

      // icon: data._links.iconSquare.href,
      // logo: data._links.logo.href,
      cover: data._links.boxArtImage.href,
      // background: data._links.galaxyBackgroundImage.href,
      screenshots,

      ...trailer,

      prices: [],
    });
  }
}

function mapFeature(f: GOGFeature) {
  const category = categoryMap.get(f.id);

  if (category === undefined) {
    console.warn(`[${name}] Unknown feature: ${f.id} (${f.name})`);
    return null;
  }

  return category;
}
