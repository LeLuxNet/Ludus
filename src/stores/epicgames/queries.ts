const catalogItemQuery = `title
id
namespace
description
releaseDate
lastModifiedDate
keyImages {
  type
  url
}
developer
seller {
  id
  name
}
productSlug
urlSlug
url
tags {
  name
  id
}
items {
  id
  namespace
}
customAttributes {
  key
  value
}
categories {
  path
}
price(country: $country) {
  totalPrice {
    discountPrice
    originalPrice
    voucherDiscount
    discount
    currencyCode
    currencyInfo {
      decimals
    }
  }
  lineOffers {
    appliedRules {
      id
      endDate
      discountSetting {
        discountType
      }
    }
  }
}`;

export const searchQuery = `
query searchStoreQuery($allowCountries: String, $category: String, $count: Int, $country: String!, $keywords: String, $locale: String, $namespace: String, $itemNs: String, $sortBy: String, $sortDir: String, $start: Int, $tag: String, $releaseDate: String, $priceRange: String, $freeGame: Boolean, $onSale: Boolean, $effectiveDate: String) {
  Catalog {
    searchStore(
      allowCountries: $allowCountries
      category: $category
      count: $count
      country: $country
      keywords: $keywords
      locale: $locale
      namespace: $namespace
      itemNs: $itemNs
      sortBy: $sortBy
      sortDir: $sortDir
      releaseDate: $releaseDate
      start: $start
      tag: $tag
      priceRange: $priceRange
      freeGame: $freeGame
      onSale: $onSale
      effectiveDate: $effectiveDate
    ) {
      elements {
        ${catalogItemQuery}
      }
      paging {
        count
        total
      }
    }
  }
}`;

export const gameQuery = `
query catalogQuery($namespace: String!, $id: String!, $locale: String, $country: String!) {
  Catalog {
    catalogOffer(namespace: $namespace, id: $id, locale: $locale) {
      ${catalogItemQuery}
    }
  }
}`;
