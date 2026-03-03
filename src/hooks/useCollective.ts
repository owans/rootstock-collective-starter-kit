/**
 * useCollective: core SDK initialization for the Collective DAO Starter Kit.
 *
 * Architecture (3-layer):
 *   W3Layer (transport) -> Base (shared logic/errors) -> Module (Collective: proposals, staking)
 *
 * When @rsksmart/collective-sdk is installed (e.g. from GitHub Packages with GITHUB_TOKEN),
 * the real SDK is used with chainId 31, rpcUrl, and contractAddresses from constants/contracts.ts.
 * Otherwise the stub in src/lib/collectiveStub.ts is used so the app still runs (sample proposals, no real chain calls).
 */

import { useMemo, useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import type { WalletClient } from "viem";
import { createCollectiveStub } from "@/lib/collectiveStub";
import type { CollectiveSDK } from "@/lib/collectiveStub";
import {
  ROOTSTOCK_TESTNET_CHAIN_ID,
  COLLECTIVE_CONTRACT_ADDRESSES,
} from "@/constants/contracts";
import { getRootstockTestnetRpcUrl } from "@/lib/utils/RootstockTestnet";

/** Chain ID for Rootstock Testnet — used to gate Collective flows. */
export const COLLECTIVE_CHAIN_ID = ROOTSTOCK_TESTNET_CHAIN_ID;

/** Result when SDK is not ready (wrong chain or no wallet). */
export interface UseCollectiveNotReady {
  isReady: false;
  sdk: null;
  walletClient: null;
  address: undefined;
  error: string | null;
}

/** Result when SDK is ready (real SDK or stub). */
export interface UseCollectiveReady {
  isReady: true;
  sdk: CollectiveSDK;
  walletClient: WalletClient | null;
  address: `0x${string}`;
  error: null;
  /** True when the real @rsksmart/collective-sdk is used; false when the stub is used (no stake/vote on-chain). */
  isRealSdk: boolean;
}

export type UseCollectiveResult = UseCollectiveNotReady | UseCollectiveReady;

type RealSDKConstructor = new (config: {
  chainId: 30 | 31;
  rpcUrl?: string;
  contractAddresses?: Record<string, `0x${string}`>;
}) => CollectiveSDK;

/**
 * Hook: returns Collective SDK (real when installed from GitHub Packages, else stub) with wallet client and address.
 * Use sdk.proposals (getProposals, castVote), sdk.staking (getStakingInfo, approveRIF, stakeRIF, unstakeRIF).
 */
export function useCollective(): UseCollectiveResult {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [RealSDK, setRealSDK] = useState<RealSDKConstructor | null>(null);

  useEffect(() => {
    import("@rsksmart/collective-sdk")
      .then((m) => {
        const Ctor = m.CollectiveSDK;
        setRealSDK(Ctor ? (() => Ctor as unknown as RealSDKConstructor) : null);
      })
      .catch(() => setRealSDK(null));
  }, []);

  return useMemo((): UseCollectiveResult => {
    const isCorrectChain = chain?.id === COLLECTIVE_CHAIN_ID;
    if (!address || !isCorrectChain) {
      return {
        isReady: false,
        sdk: null,
        walletClient: null,
        address: undefined,
        error: !address ? "Connect your wallet." : "Switch to Rootstock Testnet (Chain ID: 31).",
      };
    }

    const rpcUrl = getRootstockTestnetRpcUrl();
    const contractAddresses = COLLECTIVE_CONTRACT_ADDRESSES[ROOTSTOCK_TESTNET_CHAIN_ID];

    const sdk: CollectiveSDK = RealSDK
      ? (new RealSDK({
          chainId: ROOTSTOCK_TESTNET_CHAIN_ID as 31,
          rpcUrl,
          contractAddresses,
        }) as CollectiveSDK)
      : createCollectiveStub();

    return {
      isReady: true,
      sdk,
      walletClient: (walletClient as WalletClient | undefined) ?? null,
      address,
      error: null,
      isRealSdk: !!RealSDK,
    };
  }, [address, chain?.id, walletClient, RealSDK]);
}
