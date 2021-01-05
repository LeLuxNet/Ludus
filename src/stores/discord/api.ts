export interface DiscordDiscovery {
  total: number;
  guilds: GuildDiscovery[];
  offset: number;
  limit: number;
}

interface Guild {
  id: string;
  name: string;
  icon: string;
  description: string;
  splash: string | null;
  discovery_splash: string | null;
  features: string[];

  approximate_member_count: number;
  approximate_presence_count: number;
}

interface GuildDiscovery extends Guild {
  banner: null;

  premium_subscription_count: number;

  preferred_locale: string;
  auto_removed: boolean;

  // emojis
  emoji_count: number;

  primary_category_id: number;
  primary_category: DiscordCategory;
  categories: DiscordCategory[];

  keywords: string[];
  vanity_url_code: string;
  applications?: DiscordSimpleApplication[];
}

interface DiscordCategory {
  id: number;
  name: {
    default: string;
    localizations: { [key: string]: string };
  };
  is_primary: boolean;
}

interface DiscordSimpleApplication {
  id: string;
  name: {
    default: string;
  };
  // aliases
  publishers: DiscordDeveloper[];
  developers: DiscordDeveloper[];
}

export interface DiscordDeveloper {
  id: string;
  name: string;
}

export type DiscordChannel = DiscordOtherChannels | DiscordStoreChannel;

export interface DiscordOtherChannels {
  type: number;
}

export interface DiscordStoreChannel {
  type: 6;
  id: string;
  guild_id: string;
  name: string;
  position: number;
  permission_overwrites: DiscordOverride[];
  nsfw: boolean;
  parent_id: string | null;
}

interface DiscordOverride {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

export interface DiscordStoreListing {
  id: string;
  summary: string;
  sku: DiscordSku;
  tagline: string;
  flavor_text: string;
  description: string; // Markdown
  // staff_notes
  carousel_items?: DiscordCarouselItem[];
  guild?: Guild;

  preview_video: DiscordAsset;
  thumbnail?: DiscordAsset;
  hero_background?: DiscordAsset;
  header_logo_dark_theme?: DiscordAsset;
  hero_video?: DiscordAsset;
  box_art?: DiscordAsset;
  header_background?: DiscordAsset;
  assets?: DiscordAsset[];
}

interface DiscordSku {
  id: string;
  type: number;
  dependent_sku_id: string | null;
  application_id: string;
  manifest_labels: string[];
  access_type: number;
  name: string;
  features: number[];
  release_date: string;
  premium: boolean;
  slug: string;
  flags: string;
  genres: number[];
  legal_notice: string;
  application: DiscordApplication;
  system_requirements?: DiscordSystemRequirements;

  content_rating: {
    rating: number;
    descriptors: number[];
  };
  content_rating_agency: number;
  show_age_gate: boolean;

  price?: DiscordPrice;
}

interface DiscordApplication {
  id: string;
  name: string;
  description: string;
  summary: string;

  icon: string;
  cover_image: string;
  splash: string;

  primary_sku_id: string;
  third_party_skus: DiscordThirdPartySku[];

  overlay: boolean;
  hook: boolean;

  aliases: string[];
  slug: string;

  executables: DiscordExecutable[];

  bot_public: boolean;
  bot_require_code_grant: boolean;
  verify_key: boolean;

  publishers: DiscordDeveloper[];
  developers: DiscordDeveloper[];
}

interface DiscordPrice {
  amount: number;
  currency: string;

  sale_amount?: number;
  sale_percentage?: number;
}

interface DiscordThirdPartySku {
  id: string;
  sku: string;
  distributor: "discord" | "steam";
}

interface DiscordExecutable {
  os: "win32";
  name: string;
}

interface DiscordSystemRequirements {
  [key: string]: {
    minimum: DiscordSpecs;
    recommended: DiscordSpecs;
  };
}

interface DiscordSpecs {
  operating_system_version: string;

  cpu: string;
  gpu: string;
  ram: string | null;
  disk: string | null;
  sound_card: string | null;
  directx: string | null;
  network: string | null;
  notes: string | null;
}

type DiscordCarouselItem = YouTubeItem | DiscordAssetItem;

interface YouTubeItem {
  youtube_video_id: string;
}

export interface DiscordAssetItem {
  asset_id: string;
}

interface DiscordAsset {
  id: string;
  size: number;
  mime_type: string;
  width: number;
  height: number;
}
