import { Currency } from "../../entities/price";

export interface MSProduct {
  LastModifiedDate: string;

  LocalizedProperties: LocalizedProperty[];
  MarketProperties: MarketProperty[];

  ProductASchema: string;
  ProductBSchema: string;
  ProductId: string;

  Properties: Properties;
  AlternateIds: AlternateId[];

  DomainDataVersion: null;
  IngestionSource: string;
  IsMicrosoftProduct: boolean;
  PreferredSkuId: string;
  ProductType: "Game";
  ValidationData: ValidationData;
  // MerchandizingTags
  PartD: string;
  SandboxId: "RETAIL";
  ProductFamily: "Games";
  SchemaVersion: string;
  IsSandboxedProduct: boolean;
  ProductKind: "Game";

  DisplaySkuAvailabilities: SkuAvailabilities[];
}

interface LocalizedProperty {
  DeveloperName: string;
  PublisherName: string;
  PublisherWebsiteUri: string;
  SupportUri: string;

  EligibilityProperties: {
    Remediations: Remediation[];
    Affirmations: Affirmation[];
  };
  // Franchises
  Images: MSImage[];
  Videos: MSVideo[];

  ProductDescription: string;
  ProductTitle: string;
  ShortTitle: string;
  SortTitle: string;
  FriendlyTitle: null;
  ShortDescription: string;
  SearchTitles: SearchTitle[];
  VoiceTitle: string;

  RenderGroupDetails: null;
  // ProductDisplayRanks
  InteractiveModelConfig: null;
  Interactive3DEnabled: boolean;
  Language: string;
  Markets: Markets;
}

type Markets = string[];

interface Remediation {
  RemediationId: string;
  Description: string;
}

interface Affirmation {
  AffirmationId: string;
  AffirmationProductId: string;
  Description: string;
}

export interface MSImage {
  FileId: string;
  EISListingIdentifier: null;
  BackgroundColor: string | null;
  Caption: string;
  FileSizeInBytes: number;
  ForegroundColor: string | null;
  Height: number;
  ImagePositionInfo: string | null;
  ImagePurpose:
    | "Logo"
    | "Tile"
    | "Screenshot"
    | "BrandedKeyArt"
    | "TitledHeroArt"
    | "Poster"
    | "SuperHeroArt"
    | "Hero"
    | "BoxArt"
    | "FeaturePromotionalSquareArt"
    | "trailer";
  UnscaledImageSHA256Hash: string;
  Uri: string;
  Width: number;
}

interface MSVideo {
  Uri: string;
  VideoPurpose: "HeroTrailer";
  Height: number;
  Width: number;
  AudioEncoding: string;
  VideoEncoding: string;
  VideoPositionInfo: string;
  Caption: string;
  FileSizeInBytes: number;
  PreviewImage: MSImage;
  SortOrder: number;
}

interface SearchTitle {
  SearchTitleString: string;
  SearchTitleType: string;
}

interface MarketProperty {
  OriginalReleaseDate: string;
  MinimumUserAge: number;
  ContentRatings: ContentRating[];
  RelatedProducts: RelatedProduct[];
  UsageData: UsageData[];
  BundleConfig: null;
  Markets: Markets;
}

interface ContentRating {
  RatingSystem: string;
  RatingId: string;
  RatingDescriptors: string[];
  RatingDisclaimers: string[];
  InteractiveElements: string[];
}

interface RelatedProduct {
  RelatedProductId: string;
  RelationshipType: "Bundle";
}

interface UsageData {
  AggregateTimeSpan: "7Days" | "30Days" | "AllTime";
  AverageRating: number;
  PlayCount: number;
  RatingCount: number;
  RentalCount: string;
  TrialCount: string;
  PurchaseCount: string;
}

interface Properties {
  Attributes: Attribute[];

  CanInstallToSDCard: boolean;

  Category: string;
  Categories: string[];
  Subcategory: null;

  IsAccessible: boolean;
  IsDemo: boolean;
  IsLineOfBusinessApp: boolean;
  IsPublishedToLegacyWindowsPhoneStore: boolean;
  IsPublishedToLegacyWindowsStore: boolean;

  PackageFamilyName: string;
  PackageIdentityName: string;
  PublisherCertificateName: string;
  PublisherId: string;

  SkuDisplayGroups: SkuDisplayGroup[];

  XboxLiveTier: "Full";
  XboxXPA: null;
  XboxCrossGenSetId: null;
  XboxConsoleGenOptimized: string[];
  XboxConsoleGenCompatible: string[];
  XboxLiveGoldRequired: boolean;

  OwnershipType: null;
  PdpBackgroundColor: string;
  HasAddOns: boolean;
  RevisionId: string;
  ProductGroupId: string;
  ProductGroupName: string;
}

interface Attribute {
  Name: string;
  Minimum: number | null;
  Maximum: number | null;
  ApplicablePlatforms: string[] | null;
  Group: null;
}

interface SkuDisplayGroup {
  Id: string;
  Treatment: string;
}

interface AlternateId {
  IdType: string;
  Value: string;
}

interface ValidationData {
  PassedValidation: boolean;
  RevisionId: string;
  ValidationResultUri: string;
}

interface SkuAvailabilities {
  Sku: Sku;
  Availabilities: Availability[];
}

interface Sku {
  LastModifiedDate: string;
  LocalizedProperties: SkuLocalizedProperty[];
  MarketProperties: SkuMarketProperty[];
  ProductId: string;
  Properties: SkuProperties;
  SkuASchema: string;
  SkuBSchema: string;
  SkuId: string;
  SkuType: "full";
  RecurrencePolicy: null;
  SubscriptionPolicyId: null;
}

interface SkuLocalizedProperty {
  // Contributors
  Features: string[];
  MinimumNotes: string;
  RecommendedNotes: string;
  ReleaseNotes: string;
  DisplayPlatformProperties: null;
  SkuDescription: string;
  SkuTitle: string;
  SkuButtonTitle: string;
  DeliveryDateOverlay: null;
  // SkuDisplayRank
  TextResources: null;
  // Images
  LegalText: LegalText;
  Language: string;
  Markets: Markets;
}

interface LegalText {
  AdditionalLicenseTerms: string;

  Copyright: string;
  CopyrightUri: string;

  PrivacyPolicy: string;
  PrivacyPolicyUri: string;

  Tou: string;
  TouUri: string;
}

interface SkuMarketProperty {
  FirstAvailableDate: string;
  SupportedLanguages: string[];
  PackageIds: null;
  PIFilter: null;
  Markets: Markets;
}

interface SkuProperties {
  EarlyAdopterEnrollmentUrl: boolean;

  FulfillmentData: FulfillmentData;
  FulfillmentType: string;
  FulfillmentPluginId: string;

  HasThirdPartyIAPs: boolean;
  LastUpdateDate: string;

  HardwareProperties: HardwareProperties;
  // HardwareRequirements
  HardwareWarningList: string[];
  InstallationTerms: string;
  Packages: Package[];
  VersionString: string;
  SkuDisplayGroupIds: string[];
  XboxXPA: boolean;
  // BundledSkus
  IsRepurchasable: boolean;
  SkuDisplayRank: number;
  DisplayPhysicalStoreInventory: null;
  // VisibleToB2BServiceIds
  // AdditionalIdentifiers
  IsTrial: boolean;
  IsPreOrder: boolean;
  IsBundle: boolean;
}

interface FulfillmentData {
  ProductId: string;
  WuBundleId: string;
  WuCategoryId: string;
  PackageFamilyName: string;
  SkuId: string;
  Content: null;
  PackageFeatures: null;
}

interface HardwareProperties {
  MinimumHardware: string[];
  RecommendedHardware: string[];
  MinimumProcessor: string;
  RecommendedProcessor: string;
  MinimumGraphics: string;
  RecommendedGraphics: string;
}

interface Package {
  // Applications
  Architectures: string[];
  // Capabilities
  // DeviceCapabilities
  // ExperienceIds
  // FrameworkDependencies
  // HardwareDependencies
  // HardwareRequirements
  Hash: string;
  HashAlgorithm: string;
  IsStreamingApp: boolean;
  Languages: string[];
  MaxDownloadSizeInBytes: number;
  MaxInstallSizeInBytes: number;
  PackageFormat: string;
  PackageFamilyName: null;
  MainPackageFamilyNameForDlc: null;
  PackageFullName: "";
  PackageId: string;
  ContentId: string;
  KeyId: string;
  PackageRank: number;
  PackageUri: string;
  PlatformDependencies: PlatformDependency[];
  PlatformDependencyXmlBlob: string;
  ResourceId: string;
  Version: string;
  PackageDownloadUris: PackageDownloadUri[];
  // DriverDependencies
  FulfillmentData: FulfillmentData;
}

interface PlatformDependency {
  MaxTested: number;
  MinVersion: number;
  PlatformName: string;
}

interface PackageDownloadUri {
  Rank: number;
  Uri: string;
}

interface Availability {
  Actions: string[];
  AvailabilityASchema: string;
  AvailabilityBSchema: string;
  AvailabilityId: string;
  Conditions: Conditions;
  LastModifiedDate: string;
  Markets: Markets;
  OrderManagementData: OrderManagementData;
  Properties: AvailabilityProperties;
  SkuId: string;
  DisplayRank: number;
  AlternateIds: AlternateId[];
  RemediationRequired: boolean;
  Remediations?: Remediation[];
}

interface Conditions {
  ClientConditions: {
    AllowedPlatforms: PlatformDependency[];
  };
  EndDate: string;
  ResourceSetIds: string[];
  StartDate: string;
}

interface OrderManagementData {
  // GrantedEntitlementKeys
  PIFilter: PIFilter;
  Price: Price;
}

interface PIFilter {
  ExclusionProperties: string[];
  InclusionProperties: string[];
}

interface Price {
  CurrencyCode: Currency;
  IsPIRequired: boolean;
  ListPrice: number;
  MSRP: number;
  TaxType: "VatIncluded";
  WholesaleCurrencyCode: Currency;
  WholesalePrice: number;
}

interface AvailabilityProperties {
  OriginalReleaseDate: string;
}

interface Remediation {
  RemediationId: string;
  Type: "Upsell";
  BigId: string;
}
