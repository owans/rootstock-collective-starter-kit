/**
 * Format native balance for display in the account modal.
 * Ensures small balances (e.g. < 0.01) show meaningful decimals instead of "0".
 */

const MIN_DECIMALS_SMALL = 6;
const MAX_DECIMALS = 4;

/**
 * Format a balance for modal display. For small values (< 0.01) shows at least
 * MIN_DECIMALS_SMALL decimals so "0.000499..." is visible instead of "0".
 */
export function formatNativeBalanceDisplay(
  formatted: string | undefined,
  symbol: string
): string {
  if (formatted === undefined || formatted === "") return `0 ${symbol}`;
  const n = Number.parseFloat(formatted);
  if (Number.isNaN(n)) return `0 ${symbol}`;
  if (n === 0) return `0 ${symbol}`;
  if (n < 0.0001) return `${n.toExponential(2)} ${symbol}`;
  if (n < 0.01) {
    const fixed = n.toFixed(MIN_DECIMALS_SMALL).replace(/0+$/, "").replace(/\.$/, "");
    return `${fixed} ${symbol}`;
  }
  if (n < 1) {
    const fixed = n.toFixed(MAX_DECIMALS).replace(/0+$/, "").replace(/\.$/, "");
    return `${fixed} ${symbol}`;
  }
  if (n < 1000) return `${n.toFixed(2)} ${symbol}`;
  if (n < 1_000_000) return `${(n / 1_000).toFixed(2)}k ${symbol}`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(2)}m ${symbol}`;
  return `${(n / 1_000_000_000).toFixed(2)}b ${symbol}`;
}
