/**
 * Display formatters for proposal IDs and vote/token amounts in the UI.
 * Keeps long numbers and IDs readable without showing full raw values.
 */

const DEFAULT_DECIMALS = 18n;
const MAX_DECIMAL_PLACES = 2;

/**
 * Truncates a long proposal ID (or any long string) for display.
 * e.g. "42809812860571720497611627668561237636526895269582315644090768239243122412276"
 *  -> "428098…2276"
 */
export function formatProposalId(proposalId: string, maxVisible = 14): string {
  const s = String(proposalId).trim();
  if (s.length <= maxVisible) return s;
  return `${s.slice(0, 6)}\u2026${s.slice(-4)}`;
}

/**
 * Formats a raw vote or token amount (wei-style) for display.
 * Uses 18 decimals by default; shows up to 2 decimal places and uses locale grouping for large wholes.
 */
export function formatVoteOrAmount(value: bigint, decimals: bigint = DEFAULT_DECIMALS): string {
  if (value === 0n) return "0";
  const divisor = 10n ** decimals;
  const whole = value / divisor;
  const frac = value % divisor;
  const wholeStr =
    whole >= 1000n ? whole.toLocaleString("en-US", { useGrouping: true }) : whole.toString();
  if (frac === 0n) return wholeStr;
  const fracPadded = frac.toString().padStart(Number(decimals), "0").slice(0, MAX_DECIMAL_PLACES);
  const fracTrimmed = fracPadded.replace(/0+$/, "") || "0";
  return `${wholeStr}.${fracTrimmed}`;
}
