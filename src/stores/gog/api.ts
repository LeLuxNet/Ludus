export interface GOGPage {
  products: GOGSearchProduct[];
  ts: null;
  page: number;
  totalPages: number;
  totalResults: string;
  totalGamesFound: number;
  totalMoviesFound: number;
}

export interface GOGSearchProduct {
  // customAttributes
  developer: string;
  publisher: string;
  gallery: string[];
  video: GOGSearchVideo | null;
  supportedOperatingSystems: string[];
  genres: string[];
  globalReleaseDate: number;
  isTBA: boolean;
  price: GOGPrice;
  isDiscounted: boolean;
  isInDevelopment: boolean;
  id: number;
  releaseDate: number;
  availability: {
    isAvailable: boolean;
    isAvailableInAccount: boolean;
  };
  salesVisibility: GOGSalesVisibility;
  buyable: boolean;
  title: string;
  image: string;
  url: string;
  supportUrl: string;
  forumUrl: string;
  worksOn: GOGPlatforms;
  category: string;
  originalCategory: string;
  rating: number;
  type: number;
  isComingSoon: boolean;
  isPriceVisible: boolean;
  isMovie: boolean;
  isGame: boolean;
  slug: string;
  isWishlistable: boolean;
}

interface GOGPrice {
  amount: string;
  baseAmount: string;
  finalAmount: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountDifference: string;
  symbol: string;
  isFree: boolean;
  discount: number;
  isBonusStoreCreditIncluded: boolean;
  bonusStoreCreditAmount: string;
  promoId: string;
}

interface GOGSearchVideo {
  id: string;
  provider: "youtube";
}

interface GOGSalesVisibility {
  isActive: boolean;
  fromObject: GOGTimeObject;
  from: number;
  toObject: GOGTimeObject;
  to: number;
}

interface GOGTimeObject {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface GOGPlatforms {
  Windows: boolean;
  Mac: boolean;
  Linux: boolean;
}

export interface GOGProduct {
  inDevelopment: {
    active: boolean;
  };
  copyrights: string;
  isUsingDosBox: boolean;
  description: string;
  size: number;
  overview: string;
  _links: GOGLinks;
  _embedded: GOGEmbedded;
}

interface GOGLinks {
  self: GOGLink;
  store: GOGLink;
  support: GOGLink;
  forum: GOGLink;
  icon: GOGLink;
  iconSquare: GOGLink;
  logo: GOGLink;
  boxArtImage: GOGLink;
  backgroundImage: GOGLink;
  galaxyBackgroundImage: GOGLink;

  isIncludedInGames: GOGLink[];
}

interface GOGLink {
  href: string;
  templated?: boolean;
  formatters?: string[];
}

interface GOGEmbedded {
  // product
  productType: "GAME" | "DLC" | "PACK";
  localizations: GOGLocalization[];
  videos?: GOGVideo[];
  bonuses: GOGBonus[];
  screenshots: GOGScreenshot[];
  publisher: GOGPublisher;
  developers: GOGPublisher[];
  supportedOperatingSystems: GOGOS;
  tags: GOGTag[];

  esrbRating: GOGEsrbRating;
  pegiRating: GOGPegiRating;
  uskRating: GOGUskRating;
  brRating: GOGPegiRating;

  features: GOGFeature[];
  editions: GOGEdition[];
  series: null;
}

interface GOGLocalization {
  _embedded: {
    language: {
      code: string;
      name: string;
    };
    localizationScope: {
      type: "text" | "audio";
    };
  };
}

interface GOGVideo {
  provider: "youtube";
  videoId: string;
  thumbnailId: string;
  _links: {
    self: GOGLink;
    thumbnail: GOGLink;
  };
}

interface GOGBonus {
  id: number;
  name: string;
  type: {
    name: string;
    slug: string;
  };
}

interface GOGScreenshot {
  _links: {
    self: GOGLink;
  };
}

interface GOGPublisher {
  name: string;
}

interface GOGOS {
  operatingSystem: {
    name: string;
    version: string;
  };
  systemRequirements: GOGSysRequirements[];
}

interface GOGSysRequirements {
  type: "minimum" | "recommended";
  description: string;
  requirements: GOGRequirement[];
}

interface GOGRequirement {
  id:
    | "system"
    | "processor"
    | "memory"
    | "graphics"
    | "directx"
    | "storage"
    | "sound"
    | "other";
  name: string;
  description: string;
}

interface GOGTag {
  id: number;
  name: string;
  level: number;
  slug: string;
}

interface GOGEsrbRating {
  category: {
    name: string;
    id: number;
  };
  contentDescriptors: {
    descriptor: string;
    id: number;
  }[];
}

interface GOGPegiRating {
  ageRating: number;
  contentDescriptors: {
    descriptor: string;
  }[];
}

interface GOGUskRating {
  ageRating: number;
  category: {
    name: string;
  };
}

export interface GOGFeature {
  name: string;
  id: string;
}

interface GOGEdition {
  id: number;
  name: string;
  bonuses: GOGBonus[];
  hasProductCard: boolean;
  _links: {
    self: GOGLink;
    prices: GOGLink;
  };
}
