import { Currency } from "../../entities/price";

interface OwnedGames {
  game_count: number;
  games: SteamAppListEntry[];
}

export interface SteamAppListEntry {
  appid: number;
  name: string;

  img_icon_url: string;
  img_logo_url: string;

  has_community_visible_stats: boolean;

  playtime_2weeks: number;
  playtime_forever: number;

  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
}

export interface SteamFeatured {
  // large_capsules
  featured_win: SteamAppInfo[];
  featured_mac: SteamAppInfo[];
  featured_linux: SteamAppInfo[];
  layout: "defcon1";
  status: 1;
}

export interface SteamAppInfo {
  id: number;
  type: number;
  name: number;

  discounted: boolean;
  discount_percent: number;
  original_price: number;
  final_price: number;
  currency: Currency;

  large_capsule_image: string;
  small_capsule_image: string;

  windows_available: boolean;
  mac_available: boolean;
  linux_available: boolean;
  streamingvideo_available: boolean;

  header_image: string;

  controller_support: ControllerSupport;
}

type ControllerSupport = "partial" | "full";

export interface SteamAppDetails {
  type: "game" | "dlc" | "demo" | "advertising" | "mod" | "video";
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  dlc: number[];
  detailed_description: HTML;
  about_the_game: HTML;
  short_description: string;
  supported_languages: HTML;
  reviews?: HTML;
  header_image: string;
  website: string;

  pc_requirements: Requirements;
  mac_requirements: Requirements;
  linux_requirements: Requirements;

  legal_notice?: string;
  developers: string[];
  publishers: string[];

  demos: Demo[];
  price_overview?: SteamPrice;
  packages: number[];
  package_groups: PackageGroup[];

  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };

  metacritic: {
    score: number;
    url: string;
  };

  categories: Category[];
  genres: Category[];

  screenshots: Screenshot[];
  movies?: Movie[];

  recommendations: {
    total: number;
  };

  achievements: {
    total: number;
    highlighted: Achievement[];
  };

  release_date: {
    coming_soon: boolean;
    date: string; // dd MMM, yyyy
  };

  support_info: {
    url: string;
    email: string;
  };
  background: string;

  content_descriptors: {
    // ids
    // notes
  };
}

type HTML = string;

interface Requirements {
  minimum: HTML;
  recommended?: HTML;
}

interface Demo {
  appid: number;
  description: string;
}

interface SteamPrice {
  currency: Currency;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

interface PackageGroup {
  name: "default";
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: 0 | "1";
  is_recurring_subscription: "false";
  subs: Subscription[];
}

interface Subscription {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: "0";
  is_free_license: boolean;
  price_in_cents_with_discount: number;
}

interface Category {
  id: number;
  description: string;
}

interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  webm: VideoFormat;
  mp4: VideoFormat;
  highlight: boolean;
}

interface VideoFormat {
  "480": string;
  max: string;
}

interface Achievement {
  name: string;
  path: string;
}
