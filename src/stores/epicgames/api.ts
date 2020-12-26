interface EpicOAuthToken {
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

interface GameItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  keyImages: KeyImage[];
  categories: Category[];
  namespace: string;
  status: Status;
  creationDate: string;
  lastModifiedDate: string;
  customAttributes: CustomAttributes;
  entitlementName: string;
  entitlementType: EntitlementType;
  itemType: ItemType;
  releaseInfo: ReleaseInfo[];
  developer: string;
  developerId: string;
  eulaIds: string[];
  endOfSupport: boolean;
  mainGameItem?: GameItem;
  dlcItemList: GameItem[];
  // ageGatings
  selfRefundable: boolean;
  unsearchable: boolean;
}

interface KeyImage {
  type:
    | "Thumbnail"
    | "DieselGameBoxLogo"
    | "DieselGameBoxTall"
    | "DieselGameBox"
    | "Sale"
    | "Featured"
    | "Screenshot";
  url: string;
  md5: string;
  width: number;
  height: number;
  size: number;
  uploadedDate: string;
}

interface Category {
  path: string;
}

enum Status {
  ACTIVE = "ACTIVE",
}

interface CustomAttributes {
  [key: string]: StringAttribute;
}

interface StringAttribute {
  type: "STRING";
  value: string;
}

enum EntitlementType {
  EXECUTABLE = "EXECUTABLE",
}

enum ItemType {
  DURABLE = "DURABLE",
}

interface ReleaseInfo {
  id: string;
  appId: string;
  // compatibleApps?
  platform: Platform[];
  dateAdded: string;
  releaseNote?: string;
  versionTitle?: string;
}

type Platform = "Windows" | "Mac" | "Win32";
