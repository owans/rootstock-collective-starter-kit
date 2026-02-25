/**
 * Stub for the Collective SDK when @rsksmart/collective-sdk is not installed (e.g. optional dep from GitHub Packages skipped).
 * Read calls return empty/zero or sample data; write calls (stake, vote) throw with an explanatory message.
 * When the package is installed (GITHUB_TOKEN + npm install), useCollective uses the real SDK and this stub is not used.
 */

import type { WalletClient } from "viem";
import type { Address } from "viem";

const SDK_NOT_INSTALLED =
  "The Collective SDK is not installed. To stake and vote on-chain, install it from GitHub Packages (see README: set GITHUB_TOKEN with read:packages, then npm install).";

export interface TokenAmount {
  raw: bigint;
  formatted: string;
  decimals: number;
  symbol: string;
}

export interface ProposalsListResult {
  totalCount: number;
  proposals: ProposalSummary[];
}

export interface ProposalSummary {
  proposalId: string;
  index: number;
  state: number;
  stateLabel: string;
  proposer: Address;
  deadline: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
}

export enum VoteSupport {
  Against = 0,
  For = 1,
  Abstain = 2,
}

export interface StakingInfo {
  rifBalance: TokenAmount;
  stRifBalance: TokenAmount;
  allowance: TokenAmount;
  hasAllowance: (amount: bigint) => boolean;
}

export interface CollectiveSDK {
  readonly proposals: {
    getProposals: (options?: { offset?: number; limit?: number }) => Promise<ProposalsListResult>;
    castVote: (
      walletClient: WalletClient,
      proposalId: string | bigint,
      support: VoteSupport,
      options?: { reason?: string; skipValidation?: boolean }
    ) => Promise<{ hash: `0x${string}`; wait: (confirmations?: number) => Promise<unknown> }>;
  };
  readonly staking: {
    getStakingInfo: (userAddress: Address) => Promise<StakingInfo>;
    approveRIF: (walletClient: WalletClient, amount: bigint) => Promise<{ hash: `0x${string}`; wait: () => Promise<unknown> }>;
    stakeRIF: (walletClient: WalletClient, amount: bigint, delegatee: Address) => Promise<{ hash: `0x${string}`; wait: (c?: number) => Promise<unknown> }>;
    unstakeRIF: (walletClient: WalletClient, amount: bigint, recipient: Address) => Promise<{ hash: `0x${string}`; wait: (c?: number) => Promise<unknown> }>;
  };
}

function zeroAmount(symbol: string): TokenAmount {
  return { raw: 0n, formatted: "0", decimals: 18, symbol };
}

/** Sample proposals for demo only (stub); not on-chain. Remove when using real SDK. */
const SAMPLE_PROPOSALS: ProposalSummary[] = [
  {
    proposalId: "1",
    index: 0,
    state: 1,
    stateLabel: "Active",
    proposer: "0x0000000000000000000000000000000000000001" as Address,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 3600), // ~7 days from now
    forVotes: 1_500_000_000_000_000_000n,
    againstVotes: 200_000_000_000_000_000n,
    abstainVotes: 0n,
  },
  {
    proposalId: "2",
    index: 1,
    state: 1,
    stateLabel: "Active",
    proposer: "0x0000000000000000000000000000000000000002" as Address,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 3 * 24 * 3600), // ~3 days from now
    forVotes: 0n,
    againstVotes: 0n,
    abstainVotes: 500_000_000_000_000_000n,
  },
];

/**
 * Returns a stub CollectiveSDK for the starter kit until the real package is published.
 * Read calls return sample/empty data; write calls (stake, vote) throw with an explanatory message.
 * When using the real SDK, getProposals() will return on-chain proposals instead of samples.
 */
export function createCollectiveStub(): CollectiveSDK {
  return {
    proposals: {
      getProposals: async () => ({
        totalCount: SAMPLE_PROPOSALS.length,
        proposals: SAMPLE_PROPOSALS,
      }),
      castVote: async () => {
        throw new Error(SDK_NOT_INSTALLED);
      },
    },
    staking: {
      getStakingInfo: async () => ({
        rifBalance: zeroAmount("RIF"),
        stRifBalance: zeroAmount("stRIF"),
        allowance: zeroAmount("RIF"),
        hasAllowance: () => false,
      }),
      approveRIF: async () => {
        throw new Error(SDK_NOT_INSTALLED);
      },
      stakeRIF: async () => {
        throw new Error(SDK_NOT_INSTALLED);
      },
      unstakeRIF: async () => {
        throw new Error(SDK_NOT_INSTALLED);
      },
    },
  };
}
