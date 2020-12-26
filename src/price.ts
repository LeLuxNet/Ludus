export enum Currency {
  EUR = "EUR",
}

export type Price = PayedPrice | FreePrice;

export interface FreePrice {
  initial: 0;
  current: 0;
}

export interface PayedPrice {
  currency: Currency;

  initial: number;
  current: number;
}

export function isFree(price: Price) {
  return price.initial === 0 && price.current === 0;
}
