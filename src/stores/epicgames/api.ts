import { Currency } from "../../entities/price";

export interface EpicOAuthToken {
  access_token: string;
  expires_in: number;
  expires_at: string;

  refresh_token: string;
  refresh_expires: number;
  refresh_expires_at: string;

  account_id: string;
  client_id: string;
  internal_client: boolean;
  client_service: string;
  displayName: string;
  app: "launcher";
  in_app_id: string;
  device_id: string;
}

export interface EpicCatalogOffer {
  title: string;
  id: string;
  namespace: string;
  description: string;
  longDescription: string | null;

  effectiveDate: string;
  expiryDate: string | null;
  releaseDate: string;
  creationDate: string;
  lastModifiedDate: string;

  isCodeRedemptionOnly: boolean;
  keyImages: KeyImage[];
  currentPrice: number;
  seller: Seller;
  productSlug: string;

  urlSlug: string;
  url: string | null;

  tags: EpicTag[];
  items: Item[];
  customAttributes: CustomAttribute[];
  categories: Category[];

  price: {
    totalPrice: TotalPrice;
    lineOffers: {
      appliedRules: AppliedRule;
    }[];
  };

  status: Status;
  offerType: string;
  developer: string | null;
  eulaIds: string[] | null;
}

interface KeyImage {
  type:
    | "Thumbnail"
    | "DieselGameBoxLogo"
    | "DieselGameBoxTall"
    | "DieselGameBoxWide"
    | "DieselGameBox"
    | "DieselStoreFrontTall"
    | "DieselStoreFrontWide"
    | "OfferImageTall"
    | "OfferImageWide"
    | "TakeoverTall"
    | "TakeoverWide"
    | "TakeoverLogoSmall"
    | "TakeoverLogo"
    | "CodeRedemption_340x440"
    | "Sale"
    | "ESRB"
    | "Featured"
    | "ComingSoon"
    | "VaultClosed"
    | "Screenshot";
  url: string;
  md5: string;
  width: number;
  height: number;
  size: number;
  uploadedDate: string;
}

interface Seller {
  id: string;
  name: string;
}

export interface EpicTag {
  name: string;
  id: string;
  namespace: string;
}

interface Item {
  id: string;
  namespace: string;
}

interface CustomAttribute {
  key: string;
  value: string;
}

interface Category {
  path: string;
}

interface TotalPrice {
  discountPrice: number;
  originalPrice: number;
  voucherDiscount: number;
  discount: number;
  currencyCode: Currency;
  currencyInfo: {
    decimals: number;
  };
  fmtPrice: {
    originalPrice: string;
    discountPrice: string;
    intermediatePrice: string;
  };
}

interface AppliedRule {
  id: string;
  endDate: string;
  discountSetting: {
    discountType: string;
  };
}

enum Status {
  ACTIVE = "ACTIVE",
}

interface CatalogItem {
  title: string;
  id: string;
  namespace: string;

  eulaIds: string[];

  releaseInfo: ReleaseInfo[];
}

interface ReleaseInfo {
  appId: string;
  platform: Platform[];
}

type Platform = "Windows" | "Mac" | "Win32";

export interface EpicMediaRef {
  accountId: string;
  outputs: MediaOutput[];
  namespace: string;
}

type MediaOutput = VideoOutput | AudioOutput | ImageOutput | ManifestOutput;

interface VideoOutput {
  duration: number;
  url: string;
  width: number;
  height: number;
  key: "high" | "medium" | "low";
  contentType: "video/mp4";
}

interface AudioOutput {
  duration: number;
  url: string;
  key: "audio";
  contentType: "audio/m4a";
}

interface ImageOutput {
  url: string;
  key: "thumbnail";
  contentType: "image/png";
}

interface ManifestOutput {
  url: string;
  key: "manifest";
  contentType: "application/dash+xml";
}
