/** Error handling for Collective SDK: Insufficient VP and SDK-not-installed. */

const INSUFFICIENT_VP_PATTERN = /insufficient|voting power|VP/i;
const SDK_NOT_INSTALLED_PATTERN = /collective sdk is not installed|sdk is not installed/i;

/** True if error is insufficient voting power. */
export function isInsufficientVPError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return INSUFFICIENT_VP_PATTERN.test(message);
}

/** True if error is SDK not installed (stub in use). */
export function isSdkNotInstalledError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return SDK_NOT_INSTALLED_PATTERN.test(message);
}

/** Message shown for Insufficient VP (no context). */
export const INSUFFICIENT_VP_MESSAGE =
  "Stake more RIF or wait for the next epoch.";

/**
 * Build description for insufficient voting power: current stRIF, rule, and minimum.
 * votingPowerFormatted: e.g. "0" or "1.5" (stRIF balance for display).
 */
export function getInsufficientVPDescription(votingPowerFormatted: string | undefined): string {
  const current = votingPowerFormatted !== undefined
    ? `Your voting power: ${votingPowerFormatted} stRIF. `
    : "";
  return `${current}Voting power is based on your stRIF at the proposal snapshot (start of voting period); new stakes apply from the next epoch. You need more than 0 stRIF to vote. 1 RIF staked = 1 voting power. Stake RIF above or wait for the next epoch.`;
}

const SDK_NOT_INSTALLED_MESSAGE =
  "Staking and voting require the real Collective SDK. Run npm install. If the package is from GitHub Packages (e.g. pre-release), set GITHUB_TOKEN with read:packages scope, then run npm install. See the README.";

/** Toast title from error; fallback if not VP or SDK-not-installed. */
export function getCollectiveErrorTitle(
  error: unknown,
  fallback = "Transaction failed"
): string {
  if (isInsufficientVPError(error)) return "Insufficient voting power";
  if (isSdkNotInstalledError(error)) return "SDK not installed";
  return fallback;
}

/** Toast description from error. Pass votingPowerFormatted for insufficient-VP to show current stRIF. */
export function getCollectiveErrorDescription(
  error: unknown,
  options?: { votingPowerFormatted?: string }
): string {
  if (isInsufficientVPError(error))
    return getInsufficientVPDescription(options?.votingPowerFormatted);
  if (isSdkNotInstalledError(error)) return SDK_NOT_INSTALLED_MESSAGE;
  return error instanceof Error ? error.message : String(error);
}

/** Error message for toasts: error.message or fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
