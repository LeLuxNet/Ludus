import axios from "axios";
import { Game, GameQueue } from "../../entities/game";
import { GameType } from "../../entities/type";
import { Platform } from "../../platforms";
import { Language, Store } from "../../store";
import { MSProduct, MSImage } from "./api";

const name = "Microsoft Store";

const pcGamePassGUID = "fdd9e2a7-0fee-49f6-ad69-4354098401ff";

const lists = [
  "TopPaid",
  "New",
  "BestRated",
  "ComingSoon",
  "Deal",
  "TopFree",
  "MostPlayed",
];

export enum GamePass {
  PC = 1,
  CONSOLE = 2,
}

export class MicrosoftStore extends Store<string> {
  lang: Language;

  constructor(lang: Language) {
    super(name);
    this.lang = lang;
  }

  async gamePassGames(id: string = pcGamePassGUID): Promise<GameQueue> {
    const res = await axios.get("https://catalog.gamepass.com/sigls/v2", {
      params: {
        id,
        language: `${this.lang.lc}-${this.lang.cc}`,
        market: this.lang.cc,
      },
    });

    return res.data.slice(1).map((e: any) => () => this.getGame(e.id));
  }

  async pullGame(id: string) {
    const res = await axios.get(
      "https://displaycatalog.mp.microsoft.com/v7.0/products",
      {
        params: {
          bigIds: id,
          languages: `${this.lang.lc}-${this.lang.cc}`,
          market: this.lang.cc,
          "MS-CV": "DGU1mcuYo0WMMp+F.1",
        },
      }
    );

    const data: MSProduct = res.data.Products[0];
    const lData = data.LocalizedProperties[0];

    var smallTile: string | undefined;
    var mediumTile: string | undefined;
    var wideTile: string | undefined;
    var largeTile: string | undefined;

    var logo: string | undefined;
    var logoHeight: number;
    var logo2: string | undefined;

    var coverImg: string | undefined;
    var coverImg2: string | undefined;

    var background: string | undefined;
    var background2: string | undefined;
    var background3: string | undefined;

    const screenshots: string[] = [];

    lData.Images.forEach((e) => {
      switch (e.ImagePurpose) {
        case "Logo":
          // logo is set here with a hight
          if (logo === undefined || e.Height > logoHeight) {
            logoHeight = e.Height;
            logo = toImg(e);
          }
          break;
        case "BoxArt":
          logo2 = toImg(e);
          break;
        case "Tile":
          if (e.Height <= 100) {
            smallTile = toImg(e);
          } else if (e.Height <= 200) {
            mediumTile = toImg(e);
          } else if (e.Height <= 300) {
            wideTile = toImg(e);
          } else {
            largeTile = toImg(e);
          }
          break;
        case "Poster":
          coverImg = toImg(e);
          break;
        case "BrandedKeyArt":
          coverImg2 = toImg(e);
          break;
        case "Hero":
          background = toImg(e);
          break;
        case "TitledHeroArt":
          background2 = toImg(e);
          break;
        case "SuperHeroArt":
          background3 = toImg(e);
          break;
        case "Screenshot":
          screenshots.push(toImg(e));
          break;
      }
    });

    background = background || background2 || background3;
    logo = logo || logo2;

    const cover =
      coverImg ||
      coverImg2 ||
      // Needed for 'Broforce' (has no cover)
      background;

    const icon = logo || mediumTile || smallTile || largeTile;
    logo = wideTile || logo || largeTile;

    if (cover === undefined) {
      console.log(lData.ProductTitle);
      throw `[${name}] No cover provided`;
    }

    if (data.ProductType !== "Game") {
      throw id;
    }

    const sku = data.DisplaySkuAvailabilities[0].Sku;

    return Game.create({
      name: lData.ProductTitle,
      shortDescription: lData.ShortDescription,
      longDescription: lData.ProductDescription,
      developers: [lData.DeveloperName],
      publishers: [lData.PublisherName],

      website: lData.PublisherWebsiteUri,
      legal: sku.LocalizedProperties[0].LegalText.Copyright,

      releaseDate: new Date(data.MarketProperties[0].OriginalReleaseDate),
      lastUpdate: new Date(data.LastModifiedDate),

      type: data.Properties.IsDemo ? GameType.DEMO : GameType.GAME,
      categories: [], // tmp

      icon,
      cover,
      background,
      screenshots,

      prices: [],
    });
  }
}

function toImg(img: MSImage): string {
  return "https:" + img.Uri;
}
