interface UbiProduct {
  _type: "product";
  brand: string;
  id: string;
  image_groups: UbiImageGroup[];
  long_description: string;
  master: UbiMaster;
  min_order_quantity: number;
  name: string;
  page_description: string;
  page_title: string;
  primary_category_id: string;
  step_quantity: number;
  type: UbiType;
  variants: UbiVariant[];
  valid_from?: {
    default: string;
    [key: string]: string;
  };
  variation_attributes?: UbiVariationAttribute[];

  c_dlcContentText?: string;
  c_dlcTitle?: string;
  c_dlcType?: "extensions" | "seasonpass" | "currency";
  c_dlcWarningText?: string;
  c_globalDlcProduct?: string;

  c_freeOfferEndDateTime?: string;
  c_freeOfferProductType?: "demo";
  c_freeOfferStartDateTime?: string;
  c_freeOfferUplayGameID?: string;

  c_forceUplayBox?: boolean;
  c_hreflangjson: string;
  c_isKeyRequiredBool: boolean;
  c_legalLineEmea: string;

  c_productActivationMethodString: string;
  c_productActivationString?: string;
  c_productBrandDisplayString: string;
  c_productCompareTableHTML?: string;
  c_productCoopBool?: boolean;
  c_productCustomReleaseDateString: string;
  c_productDescriptionFirstParagraphString: string;
  c_productDeveloperString?: string;
  c_productDlcBaseString?: string;
  c_productEditionString: string;
  c_productGameDLC: "Game" | "DLC";
  c_productGenreDisplayString: string;
  c_productGenreTagString: string;
  c_productInternalNameString: string;
  c_productIsDownloadBoolean: boolean;
  c_productKeywordsString?: string;
  c_productLanguageString?: string;
  c_productMultiBool?: boolean;
  c_productMultiPlayerString?: string;
  c_productOtherEditionsListString: string[];
  c_productPlatformString?: string;
  c_productPreorderOfferHTML?: string;
  c_productPromoMessageLink?: string;
  c_productPromoMessageString: string;
  c_productPublisherString?: string;
  c_productRatingString: string;
  c_productReleaseDateTime: string;
  c_productShortNameString: string;
  c_productSingleBool: boolean;
  c_productSinglePlayerString: string;
  c_productSubBrandString: string;
  c_productTypeCategoryRefinementString: string;
  c_productTypeRefinementString: string;
  c_productTypeSelect: string;
  c_productYoutubeIds?: string[];
  c_productvideosfirst: boolean;

  // lc or lc-cc
  //
  // zh-cn => cn-s
  // zh-tw => cn-t
  // es-es => es-410 (latin america)
  c_supportedAudio?: string[];
  c_supportedInterfaces?: string[];
  c_supportedSubtitles?: string[];

  c_smartDeliveryEnabled?: boolean;
  c_display_price: string;
}

interface UbiImageGroup {
  _type: "image_group";
  images: UbiImage[];
  view_type: "large" | "pdpbanner";
}

interface UbiImage {
  _type: "image";
  alt: string;
  dis_base_link: string;
  link: string;
  title: string;
}

interface UbiMaster {
  _type: "master";
  link: string;
  master_id: string;
}

interface UbiType {
  _type: "product_type";
  master: boolean;
}

interface UbiVariant {
  _type: "variant";
  link: string;
  product_id: string;
  variation_values: {
    Platform: string;
  };
}

interface UbiVariationAttribute {
  _type: "variation_attribute";
  id: string;
  name: string;
  values: UbiVariationAttributeValue[];
}

interface UbiVariationAttributeValue {
  _type: "variation_attribute_value";
  description: string;
  name: string;
  orderable: boolean;
  value: string;
}
