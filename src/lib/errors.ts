/**
 * Centralized error handling for Collective SDK / @rskSmart/sdk-base.
 * Captures "Insufficient VP" (Voting Power) and other known SDK errors for user-facing messages.
 */

const INSUFFICIENT_VP_PATTERN = /insufficient|voting power|VP/i;
const SDK_NOT_INSTALLED_PATTERN = /collective sdk is not installed|sdk is not installed/i;

/**
 * Returns true if the error message indicates insufficient voting power (from @rskSmart/sdk-base or contracts).
 */
export function isInsufficientVPError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return INSUFFICIENT_VP_PATTERN.test(message);
}

/**
 * Returns true if the error indicates the real Collective SDK is not installed (app is using the stub).
 */
export function isSdkNotInstalledError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return SDK_NOT_INSTALLED_PATTERN.test(message);
}

/**
 * User-facing message for Insufficient VP: stake more RIF or wait for the next epoch.
 */
export const INSUFFICIENT_VP_MESSAGE =
  "Stake more RIF or wait for the next epoch.";

const SDK_NOT_INSTALLED_MESSAGE =
  "Staking and voting require the real Collective SDK. Install it from GitHub Packages: create a personal access token with read:packages, set GITHUB_TOKEN, then run npm install. See the README for details.";

/**
 * Maps a thrown error to a short title for toasts (e.g. "Insufficient voting power").
 * @param fallback - Used when the error is not an Insufficient VP error (e.g. "Stake failed").
 */
export function getCollectiveErrorTitle(
  error: unknown,
  fallback = "Transaction failed"
): string {
  if (isInsufficientVPError(error)) return "Insufficient voting power";
  if (isSdkNotInstalledError(error)) return "SDK not installed";
  return fallback;
}

/**
 * Maps a thrown error to a description for toasts.
 */
export function getCollectiveErrorDescription(error: unknown): string {
  if (isInsufficientVPError(error)) return INSUFFICIENT_VP_MESSAGE;
  if (isSdkNotInstalledError(error)) return SDK_NOT_INSTALLED_MESSAGE;
  return error instanceof Error ? error.message : String(error);
}

/**
 * Returns a user-facing error message for toasts (e.g. mint, estimate).
 * Use when you want to surface the real error message with a fallback.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
