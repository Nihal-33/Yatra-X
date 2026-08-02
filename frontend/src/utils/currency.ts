/**
 * Currency utility for formatting USD-based agent estimates into INR (₹) or USD ($)
 */

export type CurrencyType = "USD" | "INR";

const USD_TO_INR_RATE = 83.5;

/**
 * Format a USD amount into the target currency.
 */
export function formatPrice(usdAmount: number, currency: CurrencyType): string {
  const value = Number(usdAmount) || 0;
  if (currency === "INR") {
    const inrValue = Math.round(value * USD_TO_INR_RATE);
    return `₹${inrValue.toLocaleString("en-IN")}`;
  }
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

/**
 * Convert a value from USD to INR
 */
export function convertToINR(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_INR_RATE);
}

/**
 * Convert a value from INR to USD (useful for budget slider input parsing)
 */
export function convertToUSD(inrAmount: number): number {
  return Math.round(inrAmount / USD_TO_INR_RATE);
}
